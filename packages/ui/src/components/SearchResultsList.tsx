import React from 'react';
import { Hit } from '@orama/core';

interface SearchResultsListProps {
  results: Hit[];
  children: (result: Hit, index: number) => React.ReactNode;
  className?: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  children,
  className = '',
  ...props
}) => {

  return (
    <ul
      className={className}
      aria-live="polite"
      {...props}
    >
      {results.map((result, index) => (
        children(result, index)
      ))}
    </ul>
  )
}

export default SearchResultsList

