import { AnswerConfig } from '@orama/core'
import { useChat } from '../hooks'
import React, { useCallback, useEffect, useMemo } from 'react'
interface PromptTextAreaWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const PromptTextAreaWrapper: React.FC<PromptTextAreaWrapperProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

interface PromptTextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  rows?: number
  className?: string
  buttonText?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

interface PromptTextAreaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ask?: (prompt: string) => void
  disabled?: boolean
  isLoading?: boolean
  buttonText?: string
  abortContent?: React.ReactNode
  'aria-label'?: string
}

export const PromptTextAreaField: React.FC<PromptTextAreaFieldProps> = ({
  placeholder = 'Enter your prompt...',
  disabled = false,
  maxLength,
  rows = 4,
  'aria-label': ariaLabel = 'Prompt input',
  'aria-describedby': ariaDescribedBy,
  onChange,
  onKeyDown,
  ref,
  ...props
}) => {
  const { ask, context, dispatch } = useChat()
  const { userPrompt, askOptions } = context
  const internalRef = React.useRef<HTMLTextAreaElement>(null)
  const textAreaRef = ref ?? internalRef

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e)

    if (!e.defaultPrevented && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const userPrompt = e.currentTarget.value.trim()
      if (userPrompt) {
        dispatch({ type: 'SET_USER_PROMPT', payload: { userPrompt } })
        if (ask) {
          ask({ query: userPrompt, ...askOptions })
        }
        e.currentTarget.value = ''
        dispatch({ type: 'CLEAR_USER_PROMPT' })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)

    if (!e.defaultPrevented) {
      const userPrompt = e.target.value.trim()
      dispatch({ type: 'SET_USER_PROMPT', payload: { userPrompt } })
    }
  }

  useEffect(() => {
    if (
      !userPrompt &&
      typeof textAreaRef !== 'function' &&
      textAreaRef &&
      'current' in textAreaRef &&
      textAreaRef.current
    ) {
      textAreaRef.current.value = ''
    }
  }, [userPrompt, textAreaRef])

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
  )
}

export const PromptTextAreaButton: React.FC<PromptTextAreaButtonProps> = ({
  ask: onButtask,
  disabled = false,
  abortContent,
  onClick,
  children,
  ...props
}) => {
  const { ask, abort, context } = useChat()
  const { userPrompt, interactions, askOptions } = context

  const isStreaming = useMemo(
    () =>
      interactions &&
      interactions.length > 0 &&
      interactions[interactions.length - 1]?.loading,
    [interactions]
  )

  const disabledButton = useMemo(() => {
    if (disabled) return true
    if (isStreaming) return false
    if (!userPrompt) return true
    return false
  }, [disabled, isStreaming, userPrompt])

  const handleAsk = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!userPrompt) return
      try {
        await ask({ query: userPrompt, ...askOptions })
        onButtask?.(userPrompt)
        onClick?.(e)
      } catch (error) {
        console.error('Error in ask method:', error)
      }
    },
    [userPrompt, ask, onButtask, onClick, askOptions]
  )

  const handleAbort = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      abort()
      onClick?.(e)
    },
    [abort, onClick]
  )

  return (
    <button
      type='button'
      onClick={isStreaming ? handleAbort : handleAsk}
      disabled={disabledButton}
      aria-live={isStreaming ? 'polite' : undefined}
      {...props}
    >
      {isStreaming && abortContent ? abortContent : children}
    </button>
  )
}

export const PromptTextArea = {
  Field: PromptTextAreaField,
  Button: PromptTextAreaButton,
  Wrapper: PromptTextAreaWrapper
}
