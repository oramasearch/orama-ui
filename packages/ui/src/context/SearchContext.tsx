// Create a context for search functionality to store state and methods that cn be shared across components.
import { createContext, useContext } from "react";
import { CollectionManager, SearchParams, Hit } from "@orama/core";
import { GroupsCount } from "../types";

export type SearchContextProps = {
  client: CollectionManager | null;
  onSearch?: (params: SearchParams & { groupBy?: string; filterBy?: Record<string, string>[] }) => Promise<void>;
  searchTerm?: string;
  results?: Hit[] | null;
  selectedFacet?: string | null;
  groupsCount?: GroupsCount | null;
  count?: number;
}

export const initialSearchState: SearchContextProps = {
  client: null,
  searchTerm: "",
  results: null,
  selectedFacet: null,
  groupsCount: null,
  count: 0,
};

export const SearchContext = createContext<SearchContextProps>(initialSearchState);
export const SearchDispatchContext = createContext<React.Dispatch<{
  type: string;
  payload?: Partial<SearchContextProps>;
}> | null>(null);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchContext Provider");
  }
  return context;
};

export const useSearchDispatch = () => {
  const dispatch = useContext(SearchDispatchContext);
  if (!dispatch) {
    throw new Error("useSearchDispatch must be used within a SearchDispatchContext Provider");
  }
  return dispatch;
};

export const searchReducer = (state: SearchContextProps, action: { type: string; payload?: Partial<SearchContextProps> }) => {
  console.log("Search reducer action:", action);
  switch (action.type) {
    case "SET_CLIENT":
      return { ...state, client: action.payload?.client || null };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload?.searchTerm || "" };
    case "SET_RESULTS":
      return { ...state, results: action.payload?.results || [] };
    case "SET_GROUPS_COUNT":
      return { ...state, groupsCount: action.payload?.groupsCount || null };
    case "SET_SELECTED_FACET":
      return { ...state, selectedFacet: action.payload?.selectedFacet || null };
    case "SET_COUNT":
      return { ...state, count: action.payload?.count || 0 };
    default:
      return state;
  }
};
