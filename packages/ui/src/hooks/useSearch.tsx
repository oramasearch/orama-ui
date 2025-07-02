import { type SearchParams } from "@orama/core";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  initialSearchState,
  useSearchContext,
  useSearchDispatch,
} from "../contexts";
import { GroupsCount } from "@/types";

/**
 * Custom React hook for managing search functionality within the application.
 *
 * This hook provides methods to perform a search (`onSearch`), reset the search state (`onReset`),
 * and exposes loading and error states for UI feedback.
 *
 * @returns {Object} An object containing:
 * - `onSearch`: A callback function to execute a search with specified parameters.
 * - `onReset`: A callback function to reset the search state to its initial values.
 * - `context`: The current search context, providing access to the search client and other state.
 * - `dispatch`: A function to dispatch actions to the search state management.
 * - `loading`: A boolean indicating if a search operation is in progress.
 * - `error`: An `Error` object or `null` representing the current error state.
 *
 * @example
 * const { onSearch, onReset, loading, error } = useSearch();
 * onSearch({ term: "example", groupBy: "category" });
 *
 * @remarks
 * - Relies on `useSearchContext` and `useSearchDispatch` for contexts and state management.
 * - Handles grouping and filtering of search results.
 * - Ensures state updates only occur while the component is mounted.
 */
export interface useSearchReturn {
  onSearch: (
    options: SearchParams & {
      groupBy?: string;
      filterBy?: Record<string, string>[];
    },
  ) => Promise<void>;
  onReset: () => void;
  context: ReturnType<typeof useSearchContext>;
  dispatch: ReturnType<typeof useSearchDispatch>;
  loading: boolean;
  error: Error | null;
}

export function useSearch(): useSearchReturn {
  const context = useSearchContext();
  const dispatch = useSearchDispatch();
  const { client } = context;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSearch = useCallback(
    async (
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
        const res = await client.search({
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
        });

        if (!isMounted.current) return;

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
            (res.facets[groupBy] as { values: Record<string, number> }).values,
          ).map(([name, count]) => ({
            name,
            count,
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
      } catch (e) {
        if (isMounted.current) {
          setError(e as Error);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [client, dispatch],
  );

  const onReset = useCallback(() => {
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
      payload: { selectedFacet: "All" },
    });
    dispatch({
      type: "SET_COUNT",
      payload: { count: 0 },
    });
    setError(null);
  }, [dispatch]);

  return {
    onSearch,
    onReset,
    context,
    dispatch,
    loading,
    error,
  };
}
