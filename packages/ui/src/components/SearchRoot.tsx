import React, { useReducer } from 'react'
import {
  SearchContext,
  SearchDispatchContext,
  searchReducer,
  useSearchContext
} from '../contexts'
import { type SearchContextProps } from '../contexts/SearchContext'
import { Lang } from '@/types'

/**
 * SearchRoot component provides context for managing search state and actions.
 *
 * This component serves as the foundation for search functionality, managing state through
 * a reducer pattern and providing both state and dispatch contexts to child components.
 * It supports configuring the Orama client, search callbacks, and can be nested for
 * complex search scenarios.
 *
 * @example
 * // Basic usage
 * <SearchRoot initialState={{ client: orama }}>
 *   <SearchComponent />
 * </SearchRoot>
 *
 * @example
 * // With search callback and pre-populated state
 * <SearchRoot
 *.  client={orama}
 *   initialState={{
 *     search: async (params) => {
 *       console.log('Searching with:', params);
 *       // Custom search logic
 *     },
 *     searchTerm: "initial search",
 *     selectedFacet: "documents"
 *   }}
 * >
 *   <SearchComponent />
 * </SearchRoot>
 */
export interface SearchRootProps extends React.PropsWithChildren {
  /**
   * Required Orama client to be used for search operations.
   * This client is essential for executing search queries and managing results.
   */
  client: SearchContextProps['client']
  /**
   * Language for the search context.
   * This setting helps tailor search behavior and results to the specified language.
   */
  lang?: Lang
  /**
   * Initial state for the search context.
   * This allows you to configure the client, search callbacks, and pre-populate
   * the search with initial values like search terms, results, or facet selections.
   */
  initialState?: Partial<Omit<SearchContextProps, 'client' | 'lang'>>
}

export const SearchRoot = ({
  client,
  lang,
  initialState = {},
  children
}: SearchRootProps) => {
  const searchState = useSearchContext()

  if (typeof window !== 'undefined' && !client && !searchState.client) {
    console.warn(
      'SearchRoot: No client provided. Either pass a client in initialState or ensure a parent SearchRoot has a client.'
    )
  }

  const [state, dispatch] = useReducer(searchReducer, {
    ...searchState,
    client: client || searchState.client,
    lang: lang || searchState.lang,
    ...initialState
  })

  return (
    <SearchContext.Provider value={state}>
      <SearchDispatchContext.Provider value={dispatch}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  )
}
