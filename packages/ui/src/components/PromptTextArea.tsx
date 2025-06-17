import { useChatContext, useChatDispatch } from '../context/ChatContext';
import useChat from '../hooks/useChat';
import React, { useEffect } from 'react';
interface PromptTextAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PromptTextAreaWrapper: React.FC<PromptTextAreaWrapperProps> = ({
  children,
  className = '',
}) => {
  const focusTextArea = () => {
    const textArea = document.querySelector('textarea');
    if (textArea instanceof HTMLTextAreaElement) {
      textArea.focus();
    }
  };
  return (
    <div className={className} onClick={focusTextArea}>
      {children}
    </div>
  );
};

interface PromptTextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  buttonText?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

interface PromptTextAreaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onAsk: (prompt: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonText?: string;
  'aria-label'?: string;
}

export const PromptTextAreaField: React.FC<PromptTextAreaFieldProps> = ({
  onChange,
  placeholder = "Enter your prompt...",
  disabled = false,
  maxLength,
  rows = 4,
  'aria-label': ariaLabel = "Prompt input",
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const { onAsk } = useChat();
  const { userPrompt } = useChatContext();
  const dispatch = useChatDispatch();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const userPrompt = e.currentTarget.value.trim();
      if (userPrompt) {
        dispatch({ type: 'SET_USER_PROMPT', payload: { userPrompt } });
        if (onAsk) {
          onAsk({ userPrompt });
        }
        e.currentTarget.value = '';
        dispatch({ type: 'CLEAR_USER_PROMPT' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    const userPrompt = e.target.value.trim();
    dispatch({ type: 'SET_USER_PROMPT', payload: { userPrompt } });
  };

  useEffect(() => {
    if (!userPrompt && textAreaRef.current) {
      console.log('Clearing text area');
      textAreaRef.current.value = '';
    }
  }, [userPrompt]);

  return (
    <textarea
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      rows={rows}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      style={{ resize: 'none' }}
      ref={textAreaRef}
      {...props}
    />
  );
};

export const PromptTextAreaButton: React.FC<PromptTextAreaButtonProps> = ({
  onAsk: onButtonAsk,
  disabled = false,
  // isLoading = false,
  children,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);
  const { userPrompt } = useChatContext();
  const { onAsk } = useChat()

  const handleAsk = async () => {
    if (!userPrompt) return;

    setLoading(true)
    try {
      await onAsk({
        userPrompt
      });
      onButtonAsk?.(userPrompt);
    } catch (error) {
      console.error('Error in ask method:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAsk}
      disabled={disabled || loading || !userPrompt}
      {...props}
    >
      {children}
    </button>
  );
};

const PromptTextArea = {
  Field: PromptTextAreaField,
  Button: PromptTextAreaButton,
  Wrapper: PromptTextAreaWrapper,
}

export default PromptTextArea;