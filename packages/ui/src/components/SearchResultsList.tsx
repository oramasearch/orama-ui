import React from 'react';
import { Hit } from '@orama/core';

interface SearchResultsListProps {
  results: Hit[];
  children: (result: Hit, index: number) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  children,
  className = '',
  emptyMessage = 'No results found',
  ...props
}) => {
  if (results.length === 0) {
    return (
      <div className={className} role="status" aria-live="polite">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul
      className={className}
      aria-live="polite"
      role="list"
      {...props}
    >
      {results.map((result, index) => (
        <li key={result.id || `result-${index}`}>
          {children(result, index)}
        </li>
      ))}
    </ul>
  );
};

export default React.memo(SearchResultsList)