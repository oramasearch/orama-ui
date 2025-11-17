import { useSearchContext } from "@/contexts";
import { useRecentSearches, useSearch } from "@/hooks";
import { RecentSearch, SearchParams } from "@/types";
import React, { createContext, useContext } from "react";

type OnSearch = (query: string) => void;
type OnClear = () => void;

type RecentSearchesContextValue = {
  onSearch?: OnSearch;
  onClear?: OnClear;
  recentSearches?: RecentSearch[];
  addSearch?: (debounceMs?: number) => (term: string) => void;
  clearSearches?: () => void;
};

const RecentSearchesContext = createContext<RecentSearchesContextValue | null>(
  null,
);

export interface RecentSearchesProps {
  onSearch?: OnSearch;
  onClear?: OnClear;
  children?: React.ReactNode;
}

/**
 * Usage:
 * <RecentSearches onSearch={...} onClear={...}>
 *   <RecentSearches.Wrapper as="ul">
 *     <li><RecentSearches.Item query="...">Label</RecentSearches.Item></li>
 *     <RecentSearches.Clear>Clear recent</RecentSearches.Clear>
 *   </RecentSearches.Wrapper>
 * </RecentSearches>
 */
export default function RecentSearchesProvider({
  onSearch,
  onClear,
  children,
}: RecentSearchesProps) {
  const searchContext = useSearchContext();
  const { lang, namespace } = searchContext;

  const { addSearch, clearSearches, recentSearches } = useRecentSearches(
    lang,
    namespace,
  );

  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  return (
    <RecentSearchesContext.Provider
      value={{
        onSearch,
        onClear,
        recentSearches,
        addSearch,
        clearSearches,
      }}
    >
      {children}
    </RecentSearchesContext.Provider>
  );
}

export interface RecentSearchesListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  children: (term: string, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

const RecentSearchesList = ({
  children,
  className = "",
  itemClassName,
  ...rest
}: RecentSearchesListProps) => {
  const ctx = useContext(RecentSearchesContext);
  if (!ctx) {
    throw new Error(
      "RecentSearches.Item must be used within a RecentSearches.Provider",
    );
  }
  const recentSearches = ctx?.recentSearches || [];

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div>
      <ul className={className} aria-live="polite" {...rest}>
        {recentSearches.map((searchTerm, index) => (
          <li key={`searchTerm-${index}`} className={itemClassName}>
            {children(searchTerm.term, index)}
          </li>
        ))}
      </ul>
    </div>
  );
};

type ItemProps = {
  term: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  mode?: "search" | "nlp";
  searchParams?: SearchParams;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className" | "onClick"
>;

function ItemComponent({
  term,
  children,
  className,
  onClick,
  mode = "search",
  searchParams,
  ...rest
}: ItemProps) {
  const ctx = useContext(RecentSearchesContext);
  if (!ctx) {
    throw new Error(
      "RecentSearches.Item must be used within a RecentSearches.Provider",
    );
  }
  const { search, NLPSearch } = useSearch();

  const handleClick = () => {
    if (mode === "nlp") {
      NLPSearch({ query: term, ...searchParams }, false);
    } else {
      search({ term, ...searchParams }, false);
    }
    onClick?.();
    ctx?.onSearch?.(term);
  };

  return (
    <button type="button" className={className} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

type ClearProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className" | "onClick"
>;

function ClearComponent({ children, className, onClick, ...rest }: ClearProps) {
  const ctx = useContext(RecentSearchesContext);

  const { clearSearches, recentSearches } = ctx || {};

  const handleClick = () => {
    clearSearches?.();
    onClick?.();
    ctx?.onClear?.();
  };

  if (recentSearches?.length === 0) {
    return null;
  }

  return (
    <button type="button" className={className} onClick={handleClick} {...rest}>
      {children ?? "Clear"}
    </button>
  );
}
export const RecentSearches = {
  Provider: RecentSearchesProvider,
  List: RecentSearchesList,
  Item: ItemComponent,
  Clear: ClearComponent,
};
