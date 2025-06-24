import React, { ComponentPropsWithRef, useMemo } from "react";
import { Hit } from "@orama/core";
import { useSearchContext } from "../context/SearchContext";
import { GroupedResult } from "@/types";

export interface SearchResultsWrapperProps {
  children: React.ReactNode;
  /**
   * Optional class name for custom styling.
   */
  className?: string;
}

export const SearchResultsWrapper: React.FC<SearchResultsWrapperProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

export interface SearchResultsGroupedWrapperProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {
  children: (groupedResult: GroupedResult) => React.ReactNode;
  groupBy: string;
  className?: string;
}
export const SearchResultsGroupedWrapper: React.FC<
  SearchResultsGroupedWrapperProps
> = ({ children, groupBy, className = "", ...rest }) => {
  const { results } = useSearchContext();

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
    return null;
  }

  return (
    <div className={className} aria-live="polite">
      {children(searchTerm || "")}
    </div>
  );
};

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
  const { results } = useSearchContext();

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div>
      <ul className={className} aria-live="polite" {...props}>
        {results.map((result, index) => (
          <li key={result.id || `result-${index}`} className={itemClassName}>
            {children(result, index)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SearchResultsGroupList: React.FC<{
  children: (result: Hit, index: number) => React.ReactNode;
  group: GroupedResult;
  className?: string;
  itemClassName?: string;
}> = ({ children, group, className = "", itemClassName = "" }) => {
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
  onClick?: (result: Hit) => void;
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

  const isInteractive = Boolean(onClick) || Component === "a" || props.href;
  const needsKeyboardHandling =
    isInteractive && Component !== "a" && Component !== "button";

  return (
    <Component
      className={className}
      role={needsKeyboardHandling ? "button" : undefined}
      tabIndex={needsKeyboardHandling ? 0 : undefined}
      aria-label={isInteractive ? "Search result" : undefined}
      data-focus-on-arrow-nav
      {...props}
    >
      {children}
    </Component>
  );
};

const SearchResults = {
  Wrapper: SearchResultsWrapper,
  List: SearchResultsList,
  GroupsWrapper: SearchResultsGroupedWrapper,
  GroupList: SearchResultsGroupList,
  Item: SearchResultsItem,
  NoResults: SearchResultsNoResults,
};

export default SearchResults;
