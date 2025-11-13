import { NLPSearchParams, type CloudSearchParams } from '@orama/core'
import { useCallback, useEffect, useRef } from 'react'
import {
  initialSearchState,
  useSearchContext,
  useSearchDispatch
} from '../contexts'
import { GroupsCount } from '@/types'
import { useRecentSearches } from './useRecentSearches'

/**
 * Custom React hook for managing search functionality within the application.
 *
 * This hook provides methods to perform a search (`search`), reset the search state (`reset`),
 * and exposes loading and error states for UI feedback.
 *
 * @returns {Object} An object containing:
 * - `search`: A callback function to execute a search with specified parameters.
 * - `reset`: A callback function to reset the search state to its initial values.
 * - `context`: The current search context, providing access to the search client and other state.
 * - `dispatch`: A function to dispatch actions to the search state management.
 * - `loading`: A boolean indicating if a search operation is in progress.
 * - `error`: An `Error` object or `null` representing the current error state.
 *
 * @example
 * const { search, reset, loading, error } = useSearch();
 * search({ term: "example", groupBy: "category" });
 *
 * @remarks
 * - Relies on `useSearchContext` and `useSearchDispatch` for contexts and state management.
 * - Handles grouping and filtering of search results.
 * - Ensures state updates only occur while the component is mounted.
 */
export interface useSearchReturn {
  search: (options: SearchOptions, searchOnType?: boolean) => Promise<void>
  reset: () => void
  NLPSearch: (options: NLPSearchParams, searchOnType?: boolean) => Promise<void>
  context: ReturnType<typeof useSearchContext>
  dispatch: ReturnType<typeof useSearchDispatch>
}

type SearchOptions = CloudSearchParams & {
  groupedBy?: string
  filterBy?: Record<string, string>[]
}

export function useSearch(): useSearchReturn {
  const context = useSearchContext()
  const dispatch = useSearchDispatch()
  const { client, selectedFacet, lang, namespace } = context
  const isMounted = useRef(true)
  const { addSearch } = useRecentSearches(lang, namespace)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const search = useCallback(
    async (options: SearchOptions, searchOnType: boolean = true) => {
      if (!client) {
        dispatch({
          type: 'SET_ERROR',
          payload: { error: new Error('Search client is not initialized') }
        })
        dispatch({ type: 'SET_LOADING', payload: { loading: false } })
        return
      }

      dispatch({
        type: 'SET_SEARCH_TERM',
        payload: {
          searchTerm: options.term || initialSearchState.searchTerm || ''
        }
      })
      dispatch({ type: 'SET_LOADING', payload: { loading: true } })
      dispatch({ type: 'SET_ERROR', payload: { error: null } })
      addSearch(searchOnType ? 1000 : undefined)(options.term || '')

      const groupBy = options.groupBy || null

      try {
        const res = await client.search({
          ...options,
          term: options.term,
          limit: options.limit || 10,
          datasources: options.datasourceIDs || [],
          ...(options.filterBy && options.filterBy.length > 0
            ? {
                where: options.filterBy.reduce(
                  (acc, filter) => {
                    const entry = Object.entries(filter)[0]
                    if (entry) {
                      const [key, value] = entry
                      dispatch({
                        type: 'SET_SELECTED_FACET',
                        payload: { selectedFacet: key }
                      })
                      if (value === 'All') {
                        return acc
                      }
                      acc[key] = value
                    }
                    return acc
                  },
                  {} as Record<string, string>
                )
              }
            : {})
        })

        if (
          selectedFacet &&
          selectedFacet !== 'All' &&
          res.hits &&
          res.hits.length > 0 &&
          !options.filterBy
        ) {
          const facetInResults = res.hits.some((hit) => {
            return Object.values(hit.document).includes(selectedFacet)
          })
          if (!facetInResults) {
            dispatch({
              type: 'SET_SELECTED_FACET',
              payload: { selectedFacet: 'All' }
            })
          }
        }

        if (!isMounted.current) return

        dispatch({
          type: 'SET_RESULTS',
          payload: { results: res.hits || [] }
        })
        dispatch({
          type: 'SET_COUNT',
          payload: { count: res.count || 0 }
        })

        if (
          groupBy &&
          res.facets &&
          groupBy.properties[0] &&
          res.facets[groupBy.properties[0]] &&
          res.hits?.length > 0
        ) {
          const grouped: GroupsCount = Object.entries(
            (
              res.facets[groupBy.properties[0]] as {
                values: Record<string, number>
              }
            ).values
          ).map(([name, count]) => {
            return {
              name,
              count
            }
          })
          grouped.unshift({
            name: 'All',
            count: res.count || 0
          })
          dispatch({
            type: 'SET_GROUPS_COUNT',
            payload: { groupsCount: grouped }
          })
        }
      } catch (e) {
        if (isMounted.current) {
          dispatch({ type: 'SET_ERROR', payload: { error: e as Error } })
        }
      } finally {
        if (isMounted.current) {
          dispatch({ type: 'SET_LOADING', payload: { loading: false } })
        }
      }
    },
    [client, dispatch, selectedFacet, addSearch]
  )

  const reset = useCallback(() => {
    dispatch({
      type: 'SET_SEARCH_TERM',
      payload: { searchTerm: '' }
    })
    dispatch({
      type: 'SET_RESULTS',
      payload: { results: [] }
    })
    dispatch({
      type: 'SET_GROUPS_COUNT',
      payload: { groupsCount: null }
    })
    dispatch({
      type: 'SET_SELECTED_FACET',
      payload: { selectedFacet: 'All' }
    })
    dispatch({
      type: 'SET_COUNT',
      payload: { count: 0 }
    })
    dispatch({ type: 'SET_ERROR', payload: { error: null } })
  }, [dispatch])

  const NLPSearch = useCallback(
    async (options: NLPSearchParams, searchOnType: boolean = false) => {
      if (!client) {
        dispatch({
          type: 'SET_NLP_ERROR',
          payload: { error: new Error('Search client is not initialized') }
        })
        return
      }
      dispatch({
        type: 'SET_NLP_SEARCH_TERM',
        payload: {
          searchTerm: options.query || initialSearchState.searchTerm || ''
        }
      })
      dispatch({ type: 'SET_NLP_LOADING', payload: { loading: true } })
      dispatch({ type: 'SET_NLP_ERROR', payload: { error: null } })
      dispatch({
        type: 'SET_NLP_RESULTS',
        payload: { results: [] }
      })
      addSearch(searchOnType ? 1000 : undefined)(options.query || '')

      try {
        const searchResults = await client.ai.NLPSearch(options)
        const results =
          searchResults.length > 0 ? searchResults[0]?.results[0]?.hits : []
        const count =
          searchResults.length > 0 ? searchResults[0]?.results[0]?.count : 0

        dispatch({
          type: 'SET_NLP_RESULTS',
          payload: { results: results || [] }
        })
        dispatch({
          type: 'SET_NLP_COUNT',
          payload: { count: count || 0 }
        })
      } catch (e) {
        dispatch({ type: 'SET_NLP_ERROR', payload: { error: e as Error } })
      } finally {
        dispatch({ type: 'SET_NLP_LOADING', payload: { loading: false } })
      }
    },
    [client, dispatch, addSearch]
  )

  return {
    search,
    reset,
    NLPSearch,
    context,
    dispatch
  }
}
