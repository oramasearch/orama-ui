import { type SearchParams } from "@orama/core";
import { useState } from "react";
import {
  initialSearchState,
  useSearchContext,
  useSearchDispatch,
} from "../context/SearchContext";
import { GroupsCount } from "../types";
/**
 * A custom hook for managing search functionality with orama.
 *
 * @example
 * const { onSearch, loading, error } = useSearch();
 */

function useSearch() {
  const { client } = useSearchContext();
  const dispatch = useSearchDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onSearch = async (
    options: SearchParams & {
      groupBy?: string;
      filterBy?: Record<string, string>[];
    },
  ) => {
    if (!client) {
      setError(new Error("Client is not initialized"));
      setLoading(false);
      return;
    }

    dispatch({
      type: "SET_SEARCH_TERM",
      payload: { searchTerm: options.term || initialSearchState.searchTerm },
    });
    setLoading(true);
    setError(null);
    const groupBy = options.groupBy || null;

    try {
      await client
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
                        type: "SET_SELECTED_FACET",
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
            type: "SET_RESULTS",
            payload: { results: res.hits || [] },
          });
          dispatch({
            type: "SET_COUNT",
            payload: { count: res.count || 0 },
          });

          if (
            groupBy &&
            res.facets &&
            res.facets[groupBy] &&
            res.hits?.length > 0
          ) {
            const grouped: GroupsCount = Object.entries(
              (res.facets[groupBy] as { values: Record<string, number> })
                .values,
            ).map(([name, count]) => ({
              name,
              count: count,
            }));
            grouped.unshift({
              name: "All",
              count: res.count || 0,
            });
            dispatch({
              type: "SET_GROUPS_COUNT",
              payload: { groupsCount: grouped },
            });
          } else {
            const grouped = res.hits?.length
              ? [
                  {
                    name: "All",
                    count: res.count || 0,
                  },
                ]
              : null;
            dispatch({
              type: "SET_GROUPES_COUNT",
              payload: { groupsCount: grouped },
            });
          }
        });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    dispatch({
      type: "SET_SEARCH_TERM",
      payload: { searchTerm: "" },
    });
    dispatch({
      type: "SET_RESULTS",
      payload: { results: [] },
    });
    dispatch({
      type: "SET_GROUPS_COUNT",
      payload: { groupsCount: null },
    });
    dispatch({
      type: "SET_SELECTED_FACET",
      payload: { selectedFacet: null },
    });
    dispatch({
      type: "SET_COUNT",
      payload: { count: 0 },
    });
  };

  return {
    onSearch,
    onReset,
    loading,
    error,
  };
}

export default useSearch;
