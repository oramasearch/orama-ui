import { useChatContext, useChatDispatch } from '../context/ChatContext';
import { AnyObject, Interaction } from '@orama/core';
import React, { ReactNode, use, useEffect, useRef, useState } from 'react'

export interface ChatInteractionsWrapperProps {
  children: (interaction: Interaction, index: number) => ReactNode;
  className?: string;
  'aria-label'?: string;
  scrollToLast?: boolean;
  scrollOptions?: { animated: boolean; onScrollDone?: () => void };
}

export interface UserPromptProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export interface AssistantMessageProps {
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export interface UserActionsProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export interface SourcesProps {
  sources: Array<Interaction["sources"]>;
  children: (document: AnyObject, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export interface ScrollToBottomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

const ChatInteractionsWrapper: React.FC<ChatInteractionsWrapperProps> = ({ 
  children,
  className = '',
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { interactions, scrollToLastInteraction } = useChatContext();
  const dispatch = useChatDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // HANDLE SCROLL TO LAST INTERACTION TRIGGERED BY USER, IF VIA BUTTON OR AUTOMATICALLY
    if (scrollToLastInteraction && wrapperRef.current) {
      const lastInteraction = wrapperRef.current.lastElementChild;
      if (lastInteraction) {
        // lastInteraction.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
        // scroll exactely to the bottom of the wrapper
        wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight;

        // check if it's loading the response
        if (interactions && interactions.length > 0) {
          const lastInteraction = interactions[interactions.length - 1];
          if (lastInteraction && lastInteraction.response && lastInteraction.loading) {
            // // if the last interaction is loading, we don't set the visibility to true
            // dispatch({
            //   type: 'SET_LAST_INTERACTION_VISIBLE',
            //   payload: { lastInteractionVisible: false }
            // });
            return;
          }
        } else {
          dispatch({
            type: 'SET_LAST_INTERACTION_VISIBLE',
            payload: { lastInteractionVisible: true }
          });
          dispatch({
            type: 'SET_SCROLL_TO_LAST_INTERACTION',
            payload: { scrollToLastInteraction: false }
          });
        }
      }
    }
  }, [interactions, scrollToLastInteraction, dispatch]);
  

  useEffect(() => {
    // HANDLE VISIBILITY OF LAST INTERACTION ON SCROLL
    const handleScroll = () => {
      if (wrapperRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = wrapperRef.current;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;
        
        dispatch({
          type: 'SET_LAST_INTERACTION_VISIBLE',
          payload: { lastInteractionVisible: isAtBottom }
        });
        dispatch({
          type: 'SET_SCROLL_TO_LAST_INTERACTION',
          payload: { scrollToLastInteraction: false }
        });
      }
    };

    const currentWrapper = wrapperRef.current;
    currentWrapper?.addEventListener('scroll', handleScroll);

    return () => {
      currentWrapper?.removeEventListener('scroll', handleScroll);
    };
  }, [wrapperRef, dispatch]);

  useEffect(() => {
    // SCROLL TO LAST INTERACTION ON MOUNT
    if (wrapperRef.current) {
      const lastInteraction = wrapperRef.current.lastElementChild;

      if (lastInteraction) {
        lastInteraction.scrollIntoView({ behavior: 'auto', block: 'start' });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            dispatch({
              type: 'SET_LAST_INTERACTION_VISIBLE',
              payload: { lastInteractionVisible: entry.isIntersecting }
            });
            // console.log('Last interaction visibility changed:', entry.isIntersecting);
            
            // dispatch({
            //   type: 'SET_SCROLL_TO_LAST_INTERACTION',
            //   payload: { scrollToLastInteraction: entry.isIntersecting }
            // });
          });
        }, {
          root: wrapperRef.current,
          threshold: 1.0
        });
        observer.observe(lastInteraction);
        return () => {
          observer.disconnect();
        }
      }
    }
  }, [interactions, dispatch]);

  if (!interactions || interactions.length === 0) {
    return null;
  }

  return (
    <div 
      className={className}
      ref={wrapperRef}
    >
      {interactions.map((interaction, index) => 
        interaction ? (
          <div key={index}>
            {children(interaction, index)}
          </div>
        ) : null
      )}
    </div>
  );
};

const UserPrompt: React.FC<UserPromptProps> = ({ 
  children, 
  className = '',
  'aria-label': ariaLabel = 'User message'
}) => (
  <div 
    className={className}
    aria-label={ariaLabel}
  >
    {children}
  </div>
);

const AssistantMessage: React.FC<AssistantMessageProps> = ({ 
  children, 
  className = ''
}) => {
  if (!children) {
    return null;
  }

  return (
    <div 
      className={className}
    >
      {children}
    </div>
  );
};

const UserActions: React.FC<UserActionsProps> = ({ 
  children, 
  className = ''
}) => (
  <div 
    className={className}
  >
    {/* this should contain user action buttons */}
    {children}
  </div>
);

const Sources: React.FC<SourcesProps> = ({ 
  children,
  sources,
  className,
  itemClassName
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {sources.map((source, index) => (
        <>
          {source && source.document && (
            <li key={index} className={itemClassName}>
              {children(source.document as AnyObject, index)}
            </li>
          )}
        </>
      ))}
    </ul>
  )
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ 
  className = '',
  onClick,
  children
}) => {
  const { lastInteractionVisible } = useChatContext();
  const dispatch = useChatDispatch();
  
  if (lastInteractionVisible) {
    return null; 
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({
      type: 'SET_SCROLL_TO_LAST_INTERACTION',
      payload: { scrollToLastInteraction: true }
    });

    if (onClick) {
      onClick(e);
    }
  }

  return (
    <button 
      className={className} 
      onClick={handleClick}
      aria-label="Scroll to bottom"
    >
      {children}
    </button>
  );
};

const ChatInteractions = {
  UserPrompt,
  AssistantMessage,
  UserActions,
  Sources,
  ScrollToBottomButton,
  Wrapper: ChatInteractionsWrapper
}


export default ChatInteractions;