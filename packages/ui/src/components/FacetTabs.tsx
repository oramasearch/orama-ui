import React, { ComponentProps, ReactNode } from 'react'
import { GroupCount } from '@/types'
import { SearchParams } from '@orama/core'
import { useSearchContext, useSearchDispatch } from '../contexts'
import { useSearch, useArrowKeysNavigation } from '../hooks'

interface WrapperProps extends ComponentProps<'section'> {
  children: ReactNode
  className?: string
}

interface ListProps extends Omit<ComponentProps<'ul'>, 'children'> {
  children: (group: GroupedResult, isSelected: boolean) => ReactNode
  className?: string
  itemClassName?: string
}

interface ItemProps extends ComponentProps<'button'> {
  isSelected?: boolean
  searchParams?: SearchParams
  filterBy: string
  className?: string
  group: GroupCount
}

interface GroupedResult {
  name: string
  count: number
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  className = '',
  ...rest
}) => {
  const { ref, onArrowLeftRight } = useArrowKeysNavigation()
  const { results } = useSearchContext()
  if (!results || results.length === 0) {
    return null
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
  )
}

const List: React.FC<ListProps> = ({
  children,
  className,
  itemClassName,
  ...rest
}) => {
  const { groupsCount, selectedFacet } = useSearchContext()

  if (!groupsCount || groupsCount.length === 0) {
    return null
  }

  return (
    <ul className={className} {...rest}>
      {groupsCount.map((group: GroupedResult) => (
        <li key={group.name} className={itemClassName}>
          {children(group, group.name === selectedFacet)}
        </li>
      ))}
    </ul>
  )
}

const Item: React.FC<ItemProps> = ({
  children,
  group,
  isSelected = false,
  searchParams,
  filterBy,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const { onSearch } = useSearch()
  const { searchTerm } = useSearchContext()
  const dispatch = useSearchDispatch()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onSearch({
        ...(searchParams ? { ...searchParams } : {}),
        term: searchParams?.term || searchTerm || '',
        limit: searchParams?.limit || 10,
        filterBy: [{ [filterBy]: group.name }]
      })

      dispatch({
        type: 'SET_SELECTED_FACET',
        payload: { selectedFacet: group.name }
      })

      if (onClick) {
        onClick(e)
      }
    }
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      type='button'
      data-selected={isSelected}
      data-disabled={disabled}
      data-focus-on-arrow-nav={isSelected ? 'true' : undefined}
      data-focus-on-arrow-nav-left-right
      {...props}
    >
      {children}
    </button>
  )
}

export const FacetTabs = {
  Wrapper,
  List,
  Item
}
