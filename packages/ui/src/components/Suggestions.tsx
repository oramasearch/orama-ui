/**
 * Example interface:
 * <Suggestions.List>
 *  {suggestion => (
 * *    <Suggestions.Item key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
 * *      {suggestion.title}
 * *    </Suggestions.Item>
 *  )}
 * </Suggestions.List>
 */

import useChat from "../hooks/useChat";
import React from "react";

interface SuggestionsWrapper {
  className?: string;
  children: React.ReactNode;
}

const SuggestionsWrapper: React.FC<SuggestionsWrapper> = ({
  className = "",
  children,
}) => {
  return <div className={className}>{children}</div>;
};

interface SuggestionsListProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  children,
  className = "",
}) => {
  return <ul className={className}>{children}</ul>;
};

interface SuggestionsItemProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
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
  className = "",
  itemClassName = "",
}) => {
  const { onAsk } = useChat();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (onClick) {
      onClick(event);
    }
    onAsk({
      userPrompt: event.currentTarget.textContent || "",
    });
  };
  return (
    <li className={className}>
      <button type="button" className={itemClassName} onClick={handleClick} data-focus-on-arrow-nav>
        {children}
      </button>
    </li>
  );
};

const Suggestions = {
  Wrapper: SuggestionsWrapper,
  List: SuggestionsList,
  Item: SuggestionsItem,
};

export default Suggestions;
