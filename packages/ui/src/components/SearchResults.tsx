import React from "react";
import { Hit } from "@orama/core";
import { useSearchContext } from "../context/SearchContext";

/* I want to do something like this:
<SearchResults.Wrapper>
  <SearchResults.List>
    {(result, index) => (
      <SearchResults.Item
        result={result}
        onClick={() => console.log(`Clicked on ${result.document?.title}`)}
      >
        {(result.document?.title as string) && (
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {result.document?.title as string}
          </h3>
        )}
        {(result.document?.content as string) && (
          <p className="text-sm text-slate-600 dark:text-slate-400 text-ellipsis overflow-hidden">
            {(result.document?.content as string).substring(0, 100)}
            ...
          </p>
        )}
      </SearchResults.Item>
    )}
  </SearchResults.List>
  <SearchResults.NoResults>
    <p>No results found for your search.</p>
  </SearchResults.NoResults>
  <SearchResults.Error>
    <p>There was an error fetching the results.</p>
  </SearchResults.Error>
  <SearchResults.Loading>
    <p>Loading results...</p>
  </SearchResults.Loading>
  <SearchResults.Empty>
    <p>Start typing to see results.</p>
  </SearchResults.Empty>
</SearchResults.Wrapper>
*/

export interface SearchResultsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const SearchResultsWrapper: React.FC<SearchResultsWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export interface SearchResultsNoResultsProps {
  children: (searchTerm: string) => React.ReactNode;
  className?: string;
}
export const SearchResultsNoResults: React.FC<SearchResultsNoResultsProps> = ({
  children,
  className = "",
}) => {
  const { searchTerm, results } = useSearchContext();

  if (results && results.length > 0) {
    return null
  }

  return (
    <div className={className} aria-live="polite">
      {children(searchTerm || "")}
    </div>
  );
}

export interface SearchResultsListProps {
  children: (result: Hit, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
}


const SearchResultsList: React.FC<SearchResultsListProps> = ({
  children,
  className = "",
  itemClassName,
  ...props
}) => {
  const { searchTerm, results } = useSearchContext()
  console.log('SearchInputLabel rendered with term [SearchResultsList]:', searchTerm, results)
  
  if (!results || results.length === 0) {
    return null
  }

  return (
    <ul className={className} aria-live="polite" role="list" {...props}>
      {results.map((result, index) => (
        <li key={result.id || `result-${index}`} className={itemClassName}>
          {children(result, index)}
        </li>
      ))}
    </ul>
  )
}

interface SearchResultsItemProps<T extends React.ElementType = "div"> {
  result: Hit;
  as?: T;
  onClick?: (result: Hit) => void;
  children?: React.ReactNode;
  className?: string;
}

const SearchResultsItem = <T extends React.ElementType = "div">({
  result,
  as,
  onClick,
  children,
  className,
  ...props
}: SearchResultsItemProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SearchResultsItemProps<T>>) => {
  const Component = as || "div";

  const handleClick = React.useCallback(() => {
    const customEvent = new CustomEvent("search:result-click", {
      detail: {
        document: result.document,
        score: result.score,
        datasource: result.id,
      },
    });
    window.dispatchEvent(customEvent);

    onClick?.(result);
  }, [result, onClick]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const isInteractive = Boolean(onClick) || Component === "a" || props.href;
  const needsKeyboardHandling =
    isInteractive && Component !== "a" && Component !== "button";

  return (
    <Component
      className={className}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={needsKeyboardHandling ? handleKeyDown : undefined}
      role={needsKeyboardHandling ? "button" : undefined}
      tabIndex={needsKeyboardHandling ? 0 : undefined}
      aria-label={isInteractive ? "Search result" : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

const SearchResults = {
  Wrapper: SearchResultsWrapper,
  List: SearchResultsList,
  Item: SearchResultsItem,
  NoResults: SearchResultsNoResults,
}

export default SearchResults
