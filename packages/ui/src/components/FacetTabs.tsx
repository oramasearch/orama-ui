import React, { ReactNode } from "react";
import { GroupCount } from "@/types";
import { SearchParams } from "@orama/core";
import { useSearchContext, useSearchDispatch } from "../context/SearchContext";
import useSearch from "../hooks/useSearch";
import { useArrowKeysNavigation } from "../hooks/useArrowKeyNavigation";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

interface ListProps {
  children: (group: GroupedResult, isSelected: boolean) => ReactNode;
  className?: string;
  itemClassName?: string;
}

interface ItemProps {
  children: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  searchParams?: SearchParams;
  className?: string;
  disabled?: boolean;
  group: GroupCount;
}

interface GroupedResult {
  name: string;
  count: number;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className = "" }) => {
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
    >
      {children}
    </section>
  );
};

const List: React.FC<ListProps> = ({ children, className, itemClassName }) => {
  const { groupsCount, selectedFacet } = useSearchContext();

  if (!groupsCount || groupsCount.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {groupsCount.map((group: GroupedResult) => (
        <li key={group.name} className={itemClassName}>
          {children(group, group.name === selectedFacet)}
        </li>
      ))}
    </ul>
  );
};

const Item: React.FC<ItemProps> = ({
  children,
  group,
  isSelected = false,
  searchParams,
  onClick,
  className = "",
  disabled = false,
  ...props
}) => {
  const { onSearch } = useSearch();
  const { searchTerm } = useSearchContext();
  const dispatch = useSearchDispatch();

  const handleClick = () => {
    if (!disabled) {
      onSearch({
        ...(searchParams ? { ...searchParams } : {}),
        term: searchParams?.term || searchTerm || "",
        limit: searchParams?.limit || 10,
        filterBy: [{ category: group.name }],
      });

      dispatch({
        type: "SET_SELECTED_FACET",
        payload: { selectedFacet: group.name },
      });

      if (onClick) {
        onClick();
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

const FacetTabs = {
  Wrapper,
  List,
  Item,
};

export default FacetTabs;
