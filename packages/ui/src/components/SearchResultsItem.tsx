import React from 'react';

interface SearchResult {
  document?: any;
  score?: number;
  datasource_id?: string;
}

interface SearchResultsItemProps {
  result: SearchResult;
  onClick?: (result: SearchResult) => void;
  children?: React.ReactNode;
  className?: string;
}

const SearchResultsItem: React.FC<SearchResultsItemProps> = ({
  result,
  onClick,
  children,
  className,
  ...props
}) => {
  const handleClick = () => {
    const customEvent = new CustomEvent(
      "search:result-click",
      {
        detail: {
          document: result.document,
          score: result.score,
          datasource: result.datasource_id,
        },
      },
    );
    window.dispatchEvent(customEvent)

    if (onClick) {
      onClick(result)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick()
    }
  }

  return (
    <li
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </li>
  )
}

export default SearchResultsItem
