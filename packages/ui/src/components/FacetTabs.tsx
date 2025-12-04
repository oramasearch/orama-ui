import React, { ReactNode } from "react";
import { GroupCount } from "@/types";
import { SearchParams } from "@orama/core";
import { useSearchContext, useSearchDispatch } from "../contexts";
import { useSearch, useArrowKeysNavigation } from "../hooks";

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface ListProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "children"
> {
  children: (group: GroupedResult, isSelected: boolean) => ReactNode;
  className?: string;
  itemClassName?: string;
}

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  searchParams?: SearchParams;
  filterBy: string;
  className?: string;
  disabled?: boolean;
  group: GroupCount;
}

interface GroupedResult {
  name: string;
  count: number;
}

const Wrapper = ({ children, className = "", ...rest }: WrapperProps) => {
  const { ref, onArrowLeftRight } = useArrowKeysNavigation();
  const { results } = useSearchContext();
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <section
      className={className}
      ref={ref}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
        onArrowLeftRight(e.nativeEvent)
      }
      {...rest}
    >
      {children}
    </section>
  );
};

const List = ({ children, className, itemClassName, ...rest }: ListProps) => {
  const { groupsCount, selectedFacet } = useSearchContext();

  if (!groupsCount || groupsCount.length === 0) {
    return null;
  }

  return (
    <ul className={className} {...rest}>
      {groupsCount.map((group: GroupedResult) => {
        if (!group.count) return null;
        return (
          <li key={group.name} className={itemClassName}>
            {children(group, group.name === selectedFacet)}
          </li>
        );
      })}
    </ul>
  );
};

const Item = ({
  children,
  group,
  isSelected = false,
  searchParams,
  filterBy,
  onClick,
  className = "",
  disabled = false,
  ...props
}: ItemProps) => {
  const { search } = useSearch();
  const { searchTerm } = useSearchContext();
  const dispatch = useSearchDispatch();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      search({
        ...(searchParams ? { ...searchParams } : {}),
        boost: searchParams?.boost ?? {},
        term: searchParams?.term || searchTerm || "",
        limit: searchParams?.limit || 10,
        filterBy: [{ [filterBy]: group.name }],
      });

      dispatch({
        type: "SET_SELECTED_FACET",
        payload: { selectedFacet: group.name },
      });

      if (onClick) {
        onClick(e);
      }
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      type="button"
      data-selected={isSelected}
      data-disabled={disabled}
      data-focus-on-arrow-nav={isSelected ? "true" : undefined}
      data-focus-on-arrow-nav-left-right
      {...props}
    >
      {children}
    </button>
  );
};

export const FacetTabs = {
  Wrapper,
  List,
  Item,
};
