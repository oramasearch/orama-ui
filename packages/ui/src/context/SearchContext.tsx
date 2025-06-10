// Create a context for search functionality to store state and methods that cn be shared across components.
import { createContext, useContext } from "react";
import { CollectionManager, SearchParams, Hit } from "@orama/core";

export type SearchContextProps = {
  client: CollectionManager | null;
  onSearch?: (params: SearchParams & { groupBy?: string; filterBy?: Record<string, string>[] }) => Promise<void>;
  searchTerm?: string;
  results?: Hit[] | null;
  groupedResults?: { name: string; count: number }[];
  selectedFacet?: string | null;
  loading?: boolean;
  error?: Error | null;
  count?: number;
}

type GroupedResult = {
  count: number;
  name: string;
  hits: Hit[];
};

type GroupedResults = GroupedResult[];


export const initialSearchState: SearchContextProps = {
  client: null,
  searchTerm: "",
  results: null,
  groupedResults: [],
  selectedFacet: null,
  loading: false,
  error: null,
  count: 0,
};

// I want the context to provide a dispatch function to update the state, but I dont't want the user to pass the dispatch function directly.
// so the user shoud just do <SearchConntext value={{ client }}>{children}</SearchContext> and then use the useSearchContext hook to access the context and dispatch this way
// const { dispatch } = useSearchContext();
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
  switch (action.type) {
    case "SET_CLIENT":
      return { ...state, client: action.payload?.client || null };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload?.searchTerm || "" };
    case "SET_RESULTS":
      return { ...state, results: action.payload?.results || [] };
    case "SET_GROUPED_RESULTS":
      return { ...state, groupedResults: action.payload?.groupedResults || [] };
    case "SET_SELECTED_FACET":
      return { ...state, selectedFacet: action.payload?.selectedFacet || null };
    case "SET_LOADING":
      return { ...state, loading: action.payload?.loading || false };
    case "SET_ERROR":
      return { ...state, error: action.payload?.error || null };
    case "SET_COUNT":
      return { ...state, count: action.payload?.count || 0 };
    default:
      return state;
  }
};
