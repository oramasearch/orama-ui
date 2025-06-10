import {
  type SearchParams,
  type Hit,
} from "@orama/core";
import { initialSearchState, useSearchContext, useSearchDispatch } from "../context/SearchContext";

type GroupedResult = {
  count: number;
  name: string;
  hits: Hit[];
};

type GroupedResults = GroupedResult[];
/**
 * A custom hook for managing search functionality with orama.
 *
 * @example
 * const { onSearch, loading, error } = useSearch({
 *   client: collectionManager,
 *   initialSearchTerm: 'initial term',
 *   onSearchTermChange: (term) => console.log(term),
 * });
 */

function useSearch() {
  const searchState = useSearchContext();
  const dispatch = useSearchDispatch();

  const onSearch = async (
    options: SearchParams & {
      groupBy?: string;
      filterBy?: Record<string, string>[];
    },
  ) => {
    dispatch({
      type: 'SET_SEARCH_TERM',
      payload: { searchTerm: options.term || initialSearchState.searchTerm }
    });
    dispatch({
      type: 'SET_LOADING',
      payload: { loading: true }
    });
    dispatch({
      type: 'SET_ERROR',
      payload: { error: null }
    });
    const groupBy = options.groupBy || null;

    try {
      await searchState.client
        ?.search({
          ...options,
          term: options.term,
          limit: options.limit || 10,
          ...(groupBy ? { facets: { [groupBy]: {} } } : {}),
          ...(options.filterBy && options.filterBy.length > 0
            ? {
                where: options.filterBy.reduce(
                  (acc, filter) => {
                    const entry = Object.entries(filter)[0];
                    if (entry) {
                      const [key, value] = entry;
                      dispatch({
                        type: 'SET_SELECTED_FACET',
                        payload: { selectedFacet: key },
                      });
                      if (value === "All") {
                        return acc;
                      }
                      acc[key] = value;
                    }
                    return acc;
                  },
                  {} as Record<string, string>,
                ),
              }
            : {}),
        })
        .then((res) => {
          dispatch({
            type: 'SET_RESULTS',
            payload: { results: res.hits || [] }
          });
          dispatch({
            type: 'SET_COUNT',
            payload: { count: res.count || 0 }
          });

          if (
            groupBy &&
            res.facets &&
            res.facets[groupBy] &&
            res.hits?.length > 0
          ) {
            const grouped: GroupedResults = Object.entries(
              (res.facets[groupBy] as { values: Record<string, number> })
                .values,
            ).map(([name, count]) => ({
              name,
              hits: res.hits.filter((hit) => hit.document?.[groupBy] === name),
              count: count,
            }));
            grouped.unshift({
              name: "All",
              hits: res.hits || [],
              count: res.count || 0,
            });
            dispatch({
              type: 'SET_GROUPED_RESULTS',
              payload: { groupedResults: grouped }
            });
          }
        });
    } catch (e) {
      dispatch({
        type: 'SET_ERROR',
        payload: { error: e as Error }
      });
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { loading: false }
      });
    }
  }

  const onReset = () => {
    dispatch({
      type: 'SET_SEARCH_TERM',
      payload: { searchTerm: '' }
    });
    dispatch({
      type: 'SET_RESULTS',
      payload: { results: [] }
    });
    dispatch({
      type: 'SET_GROUPED_RESULTS',
      payload: { groupedResults: [] }
    });
    dispatch({
      type: 'SET_SELECTED_FACET',
      payload: { selectedFacet: null }
    });
    dispatch({
      type: 'SET_COUNT',
      payload: { count: 0 }
    });
  }

  return {
    onSearch,
    onReset
  };
}

export default useSearch;
