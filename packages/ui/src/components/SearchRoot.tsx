import React, { useReducer } from "react";
import {
  SearchContext,
  SearchDispatchContext,
  searchReducer,
  useSearchContext,
} from "../contexts";
import { type SearchContextProps } from "../contexts/SearchContext";

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
  client: SearchContextProps["client"];
  /**
   * Initial state for the search context.
   * This allows you to configure the client, search callbacks, and pre-populate
   * the search with initial values like search terms, results, or facet selections.
   */
  initialState?: Partial<Omit<SearchContextProps, "client">>;
}

export const SearchRoot = ({
  client,
  initialState = {},
  children,
}: SearchRootProps) => {
  const searchState = useSearchContext();

  if (typeof window !== "undefined" && !client && !searchState.client) {
    console.warn(
      "SearchRoot: No client provided. Either pass a client in initialState or ensure a parent SearchRoot has a client.",
    );
  }

  const [state, dispatch] = useReducer(searchReducer, {
    ...searchState,
    client: client || searchState.client,
    ...initialState,
  });

  return (
    <SearchContext value={state}>
      <SearchDispatchContext value={dispatch}>{children}</SearchDispatchContext>
    </SearchContext>
  );
};
