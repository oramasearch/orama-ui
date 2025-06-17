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
      <button type="button" className={itemClassName} onClick={handleClick}>
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
