import { useChatContext, useChatDispatch } from '../context/ChatContext';
import useChat from '../hooks/useChat';
import React from 'react';

/*
I want to use this interface
<PromptTextArea.Wrapper>
  <PromptTextArea.Field />
  <PromptTextArea.Button />
</PromptTextArea.Wrapper>
*/
interface PromptTextAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PromptTextAreaWrapper: React.FC<PromptTextAreaWrapperProps> = ({
  children,
  className = '',
}) => {
  return <div className={className}>{children}</div>;
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
  const dispatch = useChatDispatch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior of adding a new line
      console.log('Enter key pressed');
      const userPrompt = e.currentTarget.value.trim();
      if (userPrompt) {
        dispatch({ type: 'SET_USER_PROMPT', payload: { userPrompt } });
        // Trigger the onAsk method if it exists
        if (onAsk) {
          onAsk({ userPrompt });
        }
        // clear the input field after asking
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
    if (!userPrompt || !onAsk || loading) return;

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