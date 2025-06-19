import useChat from "../hooks/useChat";
import { useChatContext, useChatDispatch } from "../context/ChatContext";
import { AnyObject, Interaction } from "@orama/core";
import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight, { defaultProps, PrismTheme } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";

export interface ChatInteractionsWrapperProps {
  children: (
    interaction: Interaction,
    index?: number,
    totalInteractions?: number,
  ) => ReactNode;
  className?: string;
  "aria-label"?: string;
  scrollToLast?: boolean;
  scrollOptions?: { animated: boolean; onScrollDone?: () => void };
}

export interface UserPromptProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export interface AssistantMessageProps extends PropsWithChildren<{
  className?: string;
  theme?: PrismTheme;
  markdownClassnames?: {
    [key: string]: string;
  }
}>

export interface UserActionsProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export interface SourcesProps {
  sources: Array<Interaction["sources"]>;
  children: (document: AnyObject, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export interface ScrollToBottomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ChatInteractionsWrapper: React.FC<ChatInteractionsWrapperProps> = ({
  children,
  className = "",
}) => {
  const { interactions } = useChatContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // const isStreaming = interactions?.some(
  //   (interaction) => interaction?.loading && !interaction?.response
  // );

  // const startedInteraction = interactions?.find(
  //   (interaction) => interaction?.query && interaction?.loading
  // );

  // const scrollPromptToTop = useCallback(() => {
  //   if (promptRef.current && wrapperRef.current) {
  //     promptRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
  //   }
  // }, []);

  // const scrollToBottom = () => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //   setShowScrollToBottom(false);
  // };

  // useEffect(() => {
  //   if (!wrapperRef.current || !bottomRef.current) return;

  //   const container = wrapperRef.current;

  //   if (startedInteraction) {
  //     scrollPromptToTop();
  //   }

  //   const isOverflowing = container.scrollHeight > container.clientHeight;
    
  //   if (isOverflowing) {
  //     setShowScrollToBottom(true);
  //   } else {
  //     setShowScrollToBottom(false);
  //   }
  // }, [isStreaming, interactions]);

  if (!interactions || interactions.length === 0) return null;

  const lastIndex = interactions.length - 1;
  const lastUserIndex = interactions
    .map((i, idx) => (i?.query ? idx : -1))
    .filter(idx => idx !== -1)
    .pop();

  return (
    <div className={className} ref={wrapperRef}>
      {interactions.map((interaction, index) => {
        const isPrompt = index === lastUserIndex;
        if (!interaction) return null;
        return (
          <div key={interaction.id} ref={isPrompt ? promptRef : null}>
            {children(interaction, index, lastIndex)}
          </div>
        );
      })}
    </div>
  );
};

const UserPrompt: React.FC<UserPromptProps> = ({
  children,
  className = "",
  "aria-label": ariaLabel = "User message",
}) => (
  <div className={className} aria-label={ariaLabel}>
    {children}
  </div>
);

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  children,
  theme: customTheme,
  className = "",
}) => {
  if (!children) {
    return null;
  }

  const currentTheme = customTheme || theme;

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            if (!match) {
              return (
                <code className={`${className || ""} rounded-md px-1 py-0.5 bg-gray-200 dark:bg-gray-700 orama-inline-code`} {...props}>
                  {children}
                </code>
              );
            }

            const language = match[1];

            return (
              <div className="rounded-md overflow-x-auto py-3 px-2 mb-4 text-xs whitespace-pre" style={{ backgroundColor:  currentTheme.plain.backgroundColor }}>
                <Highlight
                  {...defaultProps}
                  code={String(children).trim()}
                  language={language as any}
                  theme={theme}
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                      {tokens.map((line, i) => {
                        const lineProps = getLineProps({ line });
                        const { key, ...restLineProps } = lineProps;
                        return (
                          <div key={i} {...restLineProps}>
                            {line.map((token, j) => {
                              const tokenProps = getTokenProps({ token });
                              const { key, ...restTokenProps } = tokenProps;
                              return (
                                <span key={j} {...restTokenProps} />
                              );
                            })}
                          </div>
                        )
                      })}
                    </pre>
                  )}
                </Highlight>
              </div>
            );
          },
          h3: ({ node, ...props }) => (
            <h3 className="text-md font-semibold my-2" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="text-xs my-2" {...props} />
          ),
        }}
      >
        {typeof children === "string" ? children : String(children)}
      </ReactMarkdown>
    </div>
  );
};

const UserActions: React.FC<UserActionsProps> = ({
  children,
  className = "",
}) => (
  <div className={className}>
    {children}
  </div>
);

const Sources: React.FC<SourcesProps> = ({
  children,
  sources,
  className,
  itemClassName,
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const hasDocument = sources.some(source => source && source.document);
  if (!hasDocument) {
    return null;
  }

  return (
    <ul className={className}>
      {sources.map((source, index) => (
        <React.Fragment key={index}>
          {source && source.document ? (
            <li key={index} className={itemClassName}>
              {children(source.document as AnyObject, index)}
            </li>
          ) : null}
        </React.Fragment>
      ))}
    </ul>
  );
};

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  className = "",
  onClick,
  children,
}) => {
  const dispatch = useChatDispatch();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({
      type: "SET_SCROLL_TO_LAST_INTERACTION",
      payload: { scrollToLastInteraction: true },
    });

    if (onClick) {
      onClick(e);
    }
  };

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

const Reset: React.FC<ActionButtonProps> = ({ children, onClick, ...rest }) => {
  const { reset } = useChat();

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    reset();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleReset} {...rest}>
      {children}
    </button>
  );
};

const RegenerateLatest: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  ...rest
}) => {
  const { regenerateLatest } = useChat();

  const handleRegenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
    regenerateLatest();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleRegenerate} {...rest}>
      {children}
    </button>
  );
};

const CopyMessage: React.FC<
  ActionButtonProps & {
    interaction: Interaction;
    copiedContent?: React.ReactNode;
  }
> = ({ onClick, interaction, children, copiedContent, ...rest }) => {
  const { copyToClipboard, copiedMessage } = useChat();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    copyToClipboard(interaction.response || "");
    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (copiedMessage === interaction.response) {
      setCopied(true);
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copiedMessage, interaction.response]);

  return (
    <button onClick={handleCopy} {...rest}>
      {copied ? (
        <>
          {copiedContent || <span>Copied!</span>}
          <span className="sr-only">Copied message to clipboard</span>
        </>
      ) : (
        children || <span>Copy</span>
      )}
    </button>
  );
};

const ChatInteractions = {
  UserPrompt,
  AssistantMessage,
  Reset,
  RegenerateLatest,
  UserActions,
  CopyMessage,
  Sources,
  ScrollToBottomButton,
  Wrapper: ChatInteractionsWrapper,
};

export default ChatInteractions;
