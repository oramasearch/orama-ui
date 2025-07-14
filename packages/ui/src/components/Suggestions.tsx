import { AnswerConfig } from '@orama/core'
import { useChat } from '../hooks'
import React from 'react'

interface SuggestionsWrapper extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SuggestionsWrapper: React.FC<SuggestionsWrapper> = ({
  className = '',
  children,
  ...rest
}) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

interface SuggestionsItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
  askOptions?: Omit<AnswerConfig, 'query'>
}

/**
 * Renders a single suggestion item as a list element containing a button.
 *
 * @param {SuggestionsItemProps} props - The props for the SuggestionsItem component.
 * @param {(event: React.MouseEvent<HTMLButtonElement>) => void} [props.onClick] - Optional click handler for the suggestion button.
 * @param {React.ReactNode} props.children - The content to display inside the suggestion button.
 * @param {string} [props.className] - Optional class name for the list item element.
 * @param {string} [props.itemClassName] - Optional class name for the button element.
 *
 * @remarks
 * When the button is clicked, it triggers the `onClick` handler if provided,
 * and then calls the `onAsk` function from the `useChat` hook with the button's text content as the user prompt.
 */
const SuggestionsItem: React.FC<SuggestionsItemProps> = ({
  onClick,
  children,
  className = '',
  askOptions = {},
  ...rest
}) => {
  const { onAsk } = useChat()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (onClick) {
      onClick(event)
    }
    onAsk({
      query: event.currentTarget.textContent || '',
      ...askOptions
    })
  }
  return (
    <button
      type='button'
      className={className}
      onClick={handleClick}
      data-focus-on-arrow-nav
      {...rest}
    >
      {children}
    </button>
  )
}

export const Suggestions = {
  Wrapper: SuggestionsWrapper,
  Item: SuggestionsItem
}
