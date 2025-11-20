import { createContext, useContext } from 'react'
import { Hit, OramaCloud } from '@orama/core'
import type { GroupsCount, Lang, SearchParams } from '@/types'

export type SearchContextProps = {
  client: OramaCloud | null
  searchParams?: SearchParams
  searchTerm?: string
  nlpSearchTerm?: string
  results?: Hit[] | null
  nlpResults?: Hit[] | null
  selectedFacet?: string | null
  groupsCount?: GroupsCount | null
  loading?: boolean
  error?: Error | null
  nlpLoading?: boolean
  nlpError?: Error | null
  count?: number
  nlpCount?: number
  lang?: Lang
  namespace?: string
}

export type SearchAction =
  | { type: 'SET_CLIENT'; payload: { client: OramaCloud | null } }
  | { type: 'SET_SEARCH_TERM'; payload: { searchTerm: string } }
  | { type: 'SET_NLP_SEARCH_TERM'; payload: { searchTerm: string } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_NLP_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: Error | null } }
  | { type: 'SET_NLP_ERROR'; payload: { error: Error | null } }
  | { type: 'SET_RESULTS'; payload: { results: Hit[] | null } }
  | { type: 'SET_NLP_RESULTS'; payload: { results: Hit[] | null } }
  | { type: 'SET_GROUPS_COUNT'; payload: { groupsCount: GroupsCount | null } }
  | { type: 'SET_SELECTED_FACET'; payload: { selectedFacet: string | null } }
  | { type: 'SET_COUNT'; payload: { count: number } }
  | { type: 'SET_NLP_COUNT'; payload: { count: number } }

export const initialSearchState: SearchContextProps = {
  client: null,
  searchParams: undefined,
  searchTerm: '',
  nlpSearchTerm: '',
  results: null,
  nlpResults: null,
  selectedFacet: 'All',
  groupsCount: null,
  loading: false,
  nlpLoading: false,
  error: null,
  nlpError: null,
  count: 0,
  nlpCount: 0,
  lang: 'english',
  namespace: undefined
}

export const SearchContext =
  createContext<SearchContextProps>(initialSearchState)
export const SearchDispatchContext =
  createContext<React.Dispatch<SearchAction> | null>(null)

export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchContext Provider')
  }
  return context
}

export const useSearchDispatch = () => {
  const dispatch = useContext(SearchDispatchContext)
  if (!dispatch) {
    throw new Error(
      'useSearchDispatch must be used within a SearchDispatchContext Provider'
    )
  }
  return dispatch
}

/**
 * Reducer function for managing the state of the search contexts.
 *
 * Handles various actions to update the search contexts state, such as setting the client,
 * search term, results, groups count, selected facet, and count.
 *
 * @param state - The current state of the search contexts.
 * @param action - An object containing the action type and optional payload to update the state.
 * @returns The updated state after applying the specified action.
 */
export const searchReducer = (
  state: SearchContextProps,
  action: SearchAction
) => {
  switch (action.type) {
    case 'SET_CLIENT':
      return { ...state, client: action.payload?.client || null }
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload?.searchTerm || '' }
    case 'SET_NLP_SEARCH_TERM':
      return { ...state, nlpSearchTerm: action.payload?.searchTerm || '' }
    case 'SET_RESULTS':
      return { ...state, results: action.payload?.results || [] }
    case 'SET_NLP_RESULTS':
      return { ...state, nlpResults: action.payload?.results || [] }
    case 'SET_GROUPS_COUNT':
      return { ...state, groupsCount: action.payload?.groupsCount || null }
    case 'SET_SELECTED_FACET':
      return { ...state, selectedFacet: action.payload?.selectedFacet || null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload?.loading || false }
    case 'SET_NLP_LOADING':
      return { ...state, nlpLoading: action.payload?.loading || false }
    case 'SET_ERROR':
      return { ...state, error: action.payload?.error || null }
    case 'SET_NLP_ERROR':
      return { ...state, nlpError: action.payload?.error || null }
    case 'SET_COUNT':
      return { ...state, count: action.payload?.count || 0 }
    case 'SET_NLP_COUNT':
      return { ...state, nlpCount: action.payload?.count || 0 }
    default:
      return state
  }
}
