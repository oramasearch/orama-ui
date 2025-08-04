import React, { useReducer } from 'react'
import {
  SearchContext,
  SearchDispatchContext,
  searchReducer,
  useSearchContext
} from '../contexts'
import { CollectionManager } from '@orama/core'

console.log('SearchRoot React version:', React.version)

export interface SearchRootProps extends React.PropsWithChildren {
  /**
   * The Orama client instance to be used for search operations.
   * If not provided, it will use the client from the SearchContext.
   */
  client?: CollectionManager
}

export const SearchRoot = ({ client, children }: SearchRootProps) => {
  const searchState = useSearchContext()
  const [state, dispatch] = useReducer(searchReducer, {
    ...searchState,
    client: client || searchState.client
  })

  return (
    <SearchContext.Provider value={state}>
      <SearchDispatchContext.Provider value={dispatch}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  )
}
