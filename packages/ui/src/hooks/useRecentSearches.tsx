import { useState, useEffect, useCallback, useRef } from "react";
import type { Lang, RecentSearch } from "@/types";

const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT = 10;
const MIN_TERM_LENGTH = 2;

// Dynamic imports for stopwords - only load what's needed
const STOPWORDS_LOADERS: Record<Lang, () => Promise<{ stopwords: string[] }>> = {
  arabic: () => import("@orama/stopwords/arabic"),
  english: () => import("@orama/stopwords/english"),
  french: () => import("@orama/stopwords/french"),
  german: () => import("@orama/stopwords/german"),
  italian: () => import("@orama/stopwords/italian"),
  japanese: () => import("@orama/stopwords/japanese"),
  portuguese: () => import("@orama/stopwords/portuguese"),
  russian: () => import("@orama/stopwords/russian"),
  spanish: () => import("@orama/stopwords/spanish"),
  turkish: () => import("@orama/stopwords/turkish"),
  armenian: () => import("@orama/stopwords/armenian"),
  bulgarian: () => import("@orama/stopwords/bulgarian"),
  danish: () => import("@orama/stopwords/danish"),
  dutch: () => import("@orama/stopwords/dutch"),
  finnish: () => import("@orama/stopwords/finnish"),
  greek: () => import("@orama/stopwords/greek"),
  hungarian: () => import("@orama/stopwords/hungarian"),
  indonesian: () => import("@orama/stopwords/indonesian"),
  norwegian: () => import("@orama/stopwords/norwegian"),
  romanian: () => import("@orama/stopwords/romanian"),
  swedish: () => import("@orama/stopwords/swedish"),
  ukrainian: () => import("@orama/stopwords/ukrainian"),
  indian: () => import("@orama/stopwords/indian"),
  irish: () => import("@orama/stopwords/irish"),
  lithuanian: () => import("@orama/stopwords/lithuanian"),
  mandarin: () => import("@orama/stopwords/mandarin"),
  nepali: () => import("@orama/stopwords/nepali"),
  sanskrit: () => import("@orama/stopwords/sanskrit"),
  serbian: () => import("@orama/stopwords/serbian"),
  slovenian: () => import("@orama/stopwords/slovenian"),
  tamil: () => import("@orama/stopwords/tamil"),
};

// Cache loaded stopwords to avoid re-importing
const stopwordsCache = new Map<Lang, string[]>();

async function getStopwords(lang: Lang): Promise<string[]> {
  if (stopwordsCache.has(lang)) {
    return stopwordsCache.get(lang)!;
  }

  try {
    const module = await STOPWORDS_LOADERS[lang]();
    const stopwords = module.stopwords;
    stopwordsCache.set(lang, stopwords);
    return stopwords;
  } catch (error) {
    console.warn(`Failed to load stopwords for language: ${lang}`, error);
    // Fallback to English stopwords
    if (lang !== 'english') {
      return getStopwords('english');
    }
    return [];
  }
}

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

export function useRecentSearches(lang: Lang = "english", namespace?: string) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (namespace) {
      const recentSearches = loadFromStorage(namespace);
      setRecentSearches(recentSearches);
    }
  }, [namespace]);

  const addSearchImmediate = useCallback(
    async (term: string) => {
      term = term.trim().toLowerCase();

      if (term.length < MIN_TERM_LENGTH) return;

      // Load stopwords dynamically
      const stopwords = await getStopwords(lang || "english");
      if (stopwords.includes(term)) return;

      const currentSearches = loadFromStorage(namespace);
      const newSearchTermList = currentSearches.filter((s) => s.term !== term);
      const newList = [
        { term, timestamp: Date.now() },
        ...newSearchTermList,
      ].slice(0, MAX_RECENT);
      saveToStorage(newList, namespace);

      setRecentSearches(newList);
    },
    [lang, namespace],
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
