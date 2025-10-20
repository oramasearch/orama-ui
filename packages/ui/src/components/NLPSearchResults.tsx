import React from 'react'
import { Hit } from '@orama/core'
import { useSearchContext } from '../contexts'
import { useSearch } from '../hooks'

export interface NLPSearchResultsWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for custom styling.
   */
  className?: string
}

export const NLPSearchResultsWrapper = ({
  children,
  className = ''
}: NLPSearchResultsWrapperProps) => {
  return <div className={className}>{children}</div>
}

export interface NLPSearchResultsNoResultsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (searchTerm: string) => React.ReactNode
  className?: string
}

export const NLPSearchResultsNoResults = ({
  children,
  className = '',
  ...rest
}: NLPSearchResultsNoResultsProps) => {
  const {
    context: { nlpSearchTerm, nlpResults, nlpLoading }
  } = useSearch()

  if (nlpLoading) {
    return null
  }

  if (nlpResults && nlpResults.length > 0) {
    return null
  }

  return (
    <div className={className} aria-live='polite' {...rest}>
      {children(nlpSearchTerm || '')}
    </div>
  )
}

export interface NLPSearchResultsLoadingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const NLPSearchResultsLoading = ({
  children,
  className = '',
  ...rest
}: NLPSearchResultsLoadingProps) => {
  const {
    context: { nlpResults, nlpLoading }
  } = useSearch()

  if (!nlpLoading) {
    return null
  }

  if (nlpResults && nlpResults.length > 0) {
    return null
  }

  return (
    <div role='status' aria-live='polite' className={className} {...rest}>
      {children}
    </div>
  )
}

export interface NLPSearchResultsErrorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (error: Error) => React.ReactNode
  className?: string
}

export const NLPSearchResultsError = ({
  children,
  className = '',
  ...rest
}: NLPSearchResultsErrorProps) => {
  const {
    context: { nlpError }
  } = useSearch()

  if (!nlpError) {
    return null
  }

  return (
    <div className={className} role='alert' {...rest}>
      {children(nlpError)}
    </div>
  )
}

export interface NLPSearchResultsListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  children: (result: Hit, index: number) => React.ReactNode
  className?: string
  itemClassName?: string
  emptyMessage?: string
}

const NLPSearchResultsList = ({
  children,
  className = '',
  itemClassName,
  ...rest
}: NLPSearchResultsListProps) => {
  const { nlpResults } = useSearchContext()

  if (!nlpResults || nlpResults.length === 0) {
    return null
  }

  return (
    <div>
      <ul className={className} aria-live='polite' {...rest}>
        {nlpResults.map((result, index) => (
          <li key={result.id || `result-${index}`} className={itemClassName}>
            {children(result, index)}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface NLPSearchResultsItemProps<T extends React.ElementType = 'div'> {
  as?: T
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  className?: string
}

const NLPSearchResultsItem = <T extends React.ElementType = 'div'>({
  as,
  onClick,
  children,
  className,
  ...props
}: NLPSearchResultsItemProps<T> &
  Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof NLPSearchResultsItemProps<T>
  >) => {
  const Component = as || 'div'

  return (
    <Component className={className} onClick={onClick} {...props}>
      {children}
    </Component>
  )
}

export const NLPSearchResults = {
  Wrapper: NLPSearchResultsWrapper,
  List: NLPSearchResultsList,
  Item: NLPSearchResultsItem,
  Loading: NLPSearchResultsLoading,
  Error: NLPSearchResultsError,
  NoResults: NLPSearchResultsNoResults
}
