import React, {
  ComponentPropsWithRef,
  useMemo,
  createContext,
  useContext,
} from "react";
import { Hit } from "@orama/core";
import { GroupedResult } from "@/types";
import { useSearch } from "../hooks";

type SearchMode = "search" | "nlp";

interface SearchResultsContextValue {
  mode: SearchMode;
}

const SearchResultsContext = createContext<SearchResultsContextValue>({
  mode: "search",
});

const useSearchResultsContext = () => {
  return useContext(SearchResultsContext);
};

const useSearchResultsData = () => {
  const { mode } = useSearchResultsContext();
  const {
    context: {
      searchTerm,
      results,
      loading,
      error,
      nlpSearchTerm,
      nlpResults,
      nlpLoading,
      nlpError,
    },
  } = useSearch();

  return useMemo(() => {
    if (mode === "nlp") {
      return {
        searchTerm: nlpSearchTerm,
        results: nlpResults,
        loading: nlpLoading,
        error: nlpError,
      };
    }

    return {
      searchTerm,
      results: results,
      loading,
      error,
    };
  }, [
    mode,
    searchTerm,
    results,
    loading,
    error,
    nlpSearchTerm,
    nlpResults,
    nlpLoading,
    nlpError,
  ]);
};

export interface SearchResultsProviderProps {
  children: React.ReactNode;
  mode?: SearchMode;
}

const SearchResultsProvider = ({
  children,
  mode = "search",
}: SearchResultsProviderProps) => {
  const value = useMemo(() => ({ mode }), [mode]);

  return (
    <SearchResultsContext.Provider value={value}>
      {children}
    </SearchResultsContext.Provider>
  );
};

export interface SearchResultsWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  mode?: SearchMode;
}

export const SearchResultsWrapper = ({
  children,
  className = "",
  mode,
  ...rest
}: SearchResultsWrapperProps) => {
  if (mode !== undefined) {
    return (
      <SearchResultsProvider mode={mode}>
        <div className={className} {...rest}>
          {children}
        </div>
      </SearchResultsProvider>
    );
  }

  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

export interface SearchResultsGroupedWrapperProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {
  children: (groupedResult: GroupedResult) => React.ReactNode;
  groupBy: string;
  className?: string;
}

export const SearchResultsGroupedWrapper = ({
  children,
  groupBy,
  className = "",
  ...rest
}: SearchResultsGroupedWrapperProps) => {
  const { results } = useSearchResultsData();

  const groupedResults = useMemo(() => {
    if (!results || results.length === 0) {
      return [];
    }
    const groupsMap = new Map<string, GroupedResult>();

    results.forEach((result) => {
      const groupValue = result.document?.[groupBy];

      if (
        !groupValue ||
        (typeof groupValue !== "string" && typeof groupValue !== "number")
      ) {
        return;
      }

      const groupKey = String(groupValue);

      if (groupsMap.has(groupKey)) {
        const existingGroup = groupsMap.get(groupKey)!;
        existingGroup.hits.push(result);
        existingGroup.count += 1;
      } else {
        groupsMap.set(groupKey, {
          name: groupKey,
          hits: [result],
          count: 1,
        });
      }
    });

    const groupsArray = Array.from(groupsMap.values());

    return groupsArray;
  }, [results, groupBy]);

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div
      className={className}
      role="region"
      aria-label="Grouped search results"
      {...rest}
    >
      {groupedResults.map((group) => (
        <React.Fragment key={group.name}>{children(group)}</React.Fragment>
      ))}
    </div>
  );
};

export interface SearchResultsNoResultsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (searchTerm: string) => React.ReactNode;
  className?: string;
}

export const SearchResultsNoResults = ({
  children,
  className = "",
  ...rest
}: SearchResultsNoResultsProps) => {
  const { searchTerm, results, loading } = useSearchResultsData();

  if (loading) {
    return null;
  }

  // I also have to check if I'm searching on typing or on submit
  if (results && results.length > 0) {
    return null;
  }

  return (
    <div className={className} aria-live="polite" {...rest}>
      {children(searchTerm || "")}
    </div>
  );
};

export interface SearchResultsLoadingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const SearchResultsLoading = ({
  children,
  className = "",
  ...rest
}: SearchResultsLoadingProps) => {
  const { results, loading } = useSearchResultsData();

  if (!loading) {
    return null;
  }

  if (results && results.length > 0) {
    return null;
  }

  return (
    <div role="status" aria-live="polite" className={className} {...rest}>
      {children}
    </div>
  );
};

export interface SearchResultsErrorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (error: Error) => React.ReactNode;
  className?: string;
}

export const SearchResultsError = ({
  children,
  className = "",
  ...rest
}: SearchResultsErrorProps) => {
  const { error } = useSearchResultsData();

  if (!error) {
    return null;
  }

  return (
    <div className={className} role="alert" {...rest}>
      {children(error)}
    </div>
  );
};

export interface SearchResultsListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  children: (result: Hit, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
}

const SearchResultsList = ({
  children,
  className = "",
  itemClassName,
  ...rest
}: SearchResultsListProps) => {
  const { results } = useSearchResultsData();

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div>
      <ul className={className} aria-live="polite" {...rest}>
        {results.map((result, index) => (
          <li key={result.id || `result-${index}`} className={itemClassName}>
            {children(result, index)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export interface SearchResultsGroupListProps {
  children: (result: Hit, index: number) => React.ReactNode;
  group: GroupedResult;
  className?: string;
  itemClassName?: string;
}

const SearchResultsGroupList = ({
  children,
  group,
  className = "",
  itemClassName = "",
}: SearchResultsGroupListProps) => {
  return (
    <ul className={className}>
      {group.hits.map((hit, index) => (
        <li key={hit.id} className={itemClassName}>
          {children(hit, index)}
        </li>
      ))}
    </ul>
  );
};

interface SearchResultsItemProps<T extends React.ElementType = "div"> {
  as?: T;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

const SearchResultsItem = <T extends React.ElementType = "div">({
  as,
  onClick,
  children,
  className,
  ...props
}: SearchResultsItemProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SearchResultsItemProps<T>>) => {
  const Component = as || "div";

  return (
    <Component className={className} onClick={onClick} {...props}>
      {children}
    </Component>
  );
};

export const SearchResults = {
  Provider: SearchResultsProvider,
  Wrapper: SearchResultsWrapper,
  List: SearchResultsList,
  GroupsWrapper: SearchResultsGroupedWrapper,
  GroupList: SearchResultsGroupList,
  Item: SearchResultsItem,
  Loading: SearchResultsLoading,
  Error: SearchResultsError,
  NoResults: SearchResultsNoResults,
};
