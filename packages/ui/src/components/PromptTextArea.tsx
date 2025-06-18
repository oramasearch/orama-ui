import { useChatContext, useChatDispatch } from "../context/ChatContext";
import useChat from "../hooks/useChat";
import React, { use, useEffect } from "react";
interface PromptTextAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PromptTextAreaWrapper: React.FC<PromptTextAreaWrapperProps> = ({
  children,
  className = "",
}) => {
  const focusTextArea = () => {
    const textArea = document.querySelector("textarea");
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

interface PromptTextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  buttonText?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

interface PromptTextAreaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onAsk?: (prompt: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonText?: string;
  abortContent?: React.ReactNode;
  "aria-label"?: string;
}

export const PromptTextAreaField: React.FC<PromptTextAreaFieldProps> = ({
  onChange,
  placeholder = "Enter your prompt...",
  disabled = false,
  maxLength,
  rows = 4,
  "aria-label": ariaLabel = "Prompt input",
  "aria-describedby": ariaDescribedBy,
  ...props
}) => {
  const { onAsk } = useChat();
  const { userPrompt } = useChatContext();
  const dispatch = useChatDispatch();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const userPrompt = e.currentTarget.value.trim();
      if (userPrompt) {
        dispatch({ type: "SET_USER_PROMPT", payload: { userPrompt } });
        if (onAsk) {
          onAsk({ userPrompt });
        }
        e.currentTarget.value = "";
        dispatch({ type: "CLEAR_USER_PROMPT" });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    const userPrompt = e.target.value.trim();
    dispatch({ type: "SET_USER_PROMPT", payload: { userPrompt } });
  };

  useEffect(() => {
    if (!userPrompt && textAreaRef.current) {
      console.log("Clearing text area");
      textAreaRef.current.value = "";
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
      style={{ resize: "none" }}
      ref={textAreaRef}
      {...props}
    />
  );
};

export const PromptTextAreaButton: React.FC<PromptTextAreaButtonProps> = ({
  onAsk: onButtonAsk,
  disabled = false,
  abortContent,
  onClick,
  children,
  ...props
}) => {
  const { userPrompt } = useChatContext();
  const { onAsk, abortAnswer } = useChat();
  const { interactions } = useChatContext();

  const isStreaming = interactions && interactions.length > 0 && interactions[interactions.length - 1]?.loading;
  const disabledButton = !userPrompt && !isStreaming || !userPrompt && !abortContent;

  const handleAsk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!userPrompt) return;

    try {
      await onAsk({
        userPrompt,
      });
      onButtonAsk?.(userPrompt);
      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      console.error("Error in ask method:", error);
    }
  };

  const handleAbort = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    abortAnswer();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={isStreaming ? handleAbort : handleAsk}
      disabled={disabled || disabledButton}
      {...props}
    >
      {isStreaming && abortContent ? (
        <span>{abortContent}</span>
      ) : (
        children
      )}
    </button>
  );
};

const PromptTextArea = {
  Field: PromptTextAreaField,
  Button: PromptTextAreaButton,
  Wrapper: PromptTextAreaWrapper
};

export default PromptTextArea;
