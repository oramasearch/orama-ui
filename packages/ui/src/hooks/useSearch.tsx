import { useRef, useState } from "react";
import {
  type CollectionManager,
  type SearchParams,
  type Hit,
} from "@orama/core";

interface UseSearchOptions {
  client?: CollectionManager;
  initialSearchTerm?: string;
  onSearchTermChange?: (val: string) => void;
}

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

function useSearch({
  client,
  initialSearchTerm = "",
  onSearchTermChange
}: UseSearchOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<Hit[]>([]);
  const [groupedResults, setGroupedResults] = useState<GroupedResults>([]);
  const [selectedFacet, setSelectedFacet] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const currentTermRef = useRef(initialSearchTerm);

  const onSearch = async (options: SearchParams & { groupBy?: string, filterBy?: Record<string, string>[] }) => {
    currentTermRef.current = options.term || initialSearchTerm;
    onSearchTermChange?.(options.term || initialSearchTerm);

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
          ...(options.filterBy && options.filterBy.length > 0 ? {
            where: options.filterBy.reduce((acc, filter) => {
              const entry = Object.entries(filter)[0];
              if (entry) {
                const [key, value] = entry;
                setSelectedFacet(value);
                if (value === "All") {
                  return acc;
                }
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string>),
          } : {})
        })
        .then((res) => {
          setResults(res.hits || []);
          setCount(res.count || 0);

          if (groupBy && res.facets && res.facets[groupBy] && res.hits?.length > 0) {
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
            setGroupedResults(grouped);
          }
        });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    onSearch,
    loading,
    error,
    results,
    groupedResults,
    selectedFacet,
    term: currentTermRef.current,
    count
  };
}

export default useSearch
