import { useState, useEffect, useCallback, useRef } from "react";
import type { RecentSearch } from "@/types";

const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT = 10;
const MIN_TERM_LENGTH = 2;

function loadFromStorage(namespace?: string): RecentSearch[] {
  try {
    const key = namespace
      ? `${RECENT_SEARCHES_KEY}_${namespace}`
      : RECENT_SEARCHES_KEY;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(searches: RecentSearch[], namespace?: string) {
  const key = namespace
    ? `${RECENT_SEARCHES_KEY}_${namespace}`
    : RECENT_SEARCHES_KEY;
  localStorage.setItem(key, JSON.stringify(searches));
}

export function useRecentSearches(namespace?: string) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (namespace) {
      const recentSearches = loadFromStorage(namespace);
      setRecentSearches(recentSearches);
    }
  }, [namespace]);

  const addSearchImmediate = useCallback(
    (term: string) => {
      term = term.trim().toLowerCase();

      if (term.length < MIN_TERM_LENGTH) return;

      const currentSearches = loadFromStorage(namespace);
      const newSearchTermList = currentSearches.filter((s) => s.term !== term);
      const newList = [
        { term, timestamp: Date.now() },
        ...newSearchTermList,
      ].slice(0, MAX_RECENT);
      saveToStorage(newList, namespace);

      setRecentSearches(newList);
    },
    [namespace],
  );

  const addSearchDebounced = useCallback(
    (term: string, ms: number) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = window.setTimeout(() => {
        addSearchImmediate(term);
      }, ms);
    },
    [addSearchImmediate],
  );

  const addSearch = (debounceMs?: number) => {
    return debounceMs
      ? (term: string) => addSearchDebounced(term, debounceMs)
      : addSearchImmediate;
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const clearSearches = useCallback(() => {
    const key = namespace
      ? `${RECENT_SEARCHES_KEY}_${namespace}`
      : RECENT_SEARCHES_KEY;
    localStorage.removeItem(key);
    setRecentSearches([]);
  }, [namespace]);

  return { recentSearches, addSearch, clearSearches };
}
