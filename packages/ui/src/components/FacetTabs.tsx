
import React, { ReactNode } from 'react';
import { GroupCount } from '@/types';
import { SearchParams } from '@orama/core';
import { useSearchContext, useSearchDispatch } from '../context/SearchContext';
import useSearch from '../hooks/useSearch';

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

interface ListProps {
  children: (group: GroupedResult) => ReactNode;
  className?: string;
  itemClassName?: string;
}

interface ItemProps {
  children: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  searchParams?: SearchParams
  className?: string;
  disabled?: boolean;
  group: GroupCount;
}

interface GroupedResult {
  name: string;
  count: number;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const List: React.FC<ListProps> = ({ children, className, itemClassName }) => {
  const { groupsCount } = useSearchContext();

  if (!groupsCount || groupsCount.length === 0) {
    return null; 
  }

  return (
    <ul className={className}>
      {groupsCount.map((group: GroupedResult) => (
        <li key={group.name} className={itemClassName}>
          {children(group)}
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
  className = '',
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
        term: searchParams?.term || searchTerm || '',
        limit: searchParams?.limit || 10,
        filterBy: [{ category: group.name }],
      });

      dispatch({
        type: 'SET_SELECTED_FACET',
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
      {...props}
    >
      {children}
    </button>
  );
};

const FacetTabs = {
  Wrapper,
  List,
  Item
};

export default FacetTabs;
