import { useState, useEffect, useCallback, useRef } from 'react'
import { stopwords as arabic_stopwords } from '@orama/stopwords/arabic'
import { stopwords as english_stopwords } from '@orama/stopwords/english'
import { stopwords as french_stopwords } from '@orama/stopwords/french'
import { stopwords as german_stopwords } from '@orama/stopwords/german'
import { stopwords as italian_stopwords } from '@orama/stopwords/italian'
import { stopwords as japanese_stopwords } from '@orama/stopwords/japanese'
import { stopwords as portuguese_stopwords } from '@orama/stopwords/portuguese'
import { stopwords as russian_stopwords } from '@orama/stopwords/russian'
import { stopwords as spanish_stopwords } from '@orama/stopwords/spanish'
import { stopwords as turkish_stopwords } from '@orama/stopwords/turkish'
import { stopwords as armenian_stopwords } from '@orama/stopwords/armenian'
import { stopwords as bulgarian_stopwords } from '@orama/stopwords/bulgarian'
import { stopwords as danish_stopwords } from '@orama/stopwords/danish'
import { stopwords as dutch_stopwords } from '@orama/stopwords/dutch'
import { stopwords as finnish_stopwords } from '@orama/stopwords/finnish'
import { stopwords as greek_stopwords } from '@orama/stopwords/greek'
import { stopwords as hungarian_stopwords } from '@orama/stopwords/hungarian'
import { stopwords as indonesian_stopwords } from '@orama/stopwords/indonesian'
import { stopwords as norwegian_stopwords } from '@orama/stopwords/norwegian'
import { stopwords as romanian_stopwords } from '@orama/stopwords/romanian'
import { stopwords as swedish_stopwords } from '@orama/stopwords/swedish'
import { stopwords as ukrainian_stopwords } from '@orama/stopwords/ukrainian'
import { stopwords as indian_stopwords } from '@orama/stopwords/indian'
import { stopwords as irish_stopwords } from '@orama/stopwords/irish'
import { stopwords as lithuanian_stopwords } from '@orama/stopwords/lithuanian'
import { stopwords as mandarin_stopwords } from '@orama/stopwords/mandarin'
import { stopwords as nepali_stopwords } from '@orama/stopwords/nepali'
import { stopwords as sanskrit_stopwords } from '@orama/stopwords/sanskrit'
import { stopwords as serbian_stopwords } from '@orama/stopwords/serbian'
import { stopwords as slovenian_stopwords } from '@orama/stopwords/slovenian'
import { stopwords as tamil_stopwords } from '@orama/stopwords/tamil'
import { Lang } from '@/types'

const RECENT_SEARCHES_KEY = 'recent_searches'
const MAX_RECENT = 10
const MIN_TERM_LENGTH = 2

interface RecentSearch {
  term: string
  timestamp: number
}

const STOPWORDS: Record<Lang, string[]> = {
  arabic: arabic_stopwords,
  english: english_stopwords,
  french: french_stopwords,
  german: german_stopwords,
  italian: italian_stopwords,
  japanese: japanese_stopwords,
  portuguese: portuguese_stopwords,
  russian: russian_stopwords,
  spanish: spanish_stopwords,
  turkish: turkish_stopwords,
  armenian: armenian_stopwords,
  bulgarian: bulgarian_stopwords,
  danish: danish_stopwords,
  dutch: dutch_stopwords,
  finnish: finnish_stopwords,
  greek: greek_stopwords,
  hungarian: hungarian_stopwords,
  indonesian: indonesian_stopwords,
  norwegian: norwegian_stopwords,
  romanian: romanian_stopwords,
  swedish: swedish_stopwords,
  ukrainian: ukrainian_stopwords,
  indian: indian_stopwords,
  irish: irish_stopwords,
  lithuanian: lithuanian_stopwords,
  mandarin: mandarin_stopwords,
  nepali: nepali_stopwords,
  sanskrit: sanskrit_stopwords,
  serbian: serbian_stopwords,
  slovenian: slovenian_stopwords,
  tamil: tamil_stopwords
}

function loadFromStorage(namespace?: string): RecentSearch[] {
  try {
    const key = namespace
      ? `${RECENT_SEARCHES_KEY}_${namespace}`
      : RECENT_SEARCHES_KEY
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage(searches: RecentSearch[], namespace?: string) {
  const key = namespace
    ? `${RECENT_SEARCHES_KEY}_${namespace}`
    : RECENT_SEARCHES_KEY
  localStorage.setItem(key, JSON.stringify(searches))
}

export function useRecentSearches(lang: Lang = 'english', namespace?: string) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const recentSearches = loadFromStorage(namespace)
    setRecentSearches(recentSearches)
  }, [namespace])

  const addSearchImmediate = useCallback(
    (term: string) => {
      term = term.trim().toLowerCase()

      if (term.length < MIN_TERM_LENGTH) return
      if (STOPWORDS[lang || 'english'].includes(term)) return

      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.term !== term)
        const newList = [{ term, timestamp: Date.now() }, ...filtered].slice(
          0,
          MAX_RECENT
        )
        saveToStorage(newList, namespace)
        return newList
      })
    },
    [lang, namespace]
  )

  const addSearchDebounced = useCallback(
    (term: string, ms: number) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      debounceTimeout.current = window.setTimeout(() => {
        addSearchImmediate(term)
      }, ms)
    },
    [addSearchImmediate]
  )

  const addSearch = (debounceMs?: number) => {
    return debounceMs
      ? (term: string) => addSearchDebounced(term, debounceMs)
      : addSearchImmediate
  }

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  const clearSearches = useCallback(() => {
    const key = namespace
      ? `${RECENT_SEARCHES_KEY}_${namespace}`
      : RECENT_SEARCHES_KEY
    localStorage.removeItem(key)
    setRecentSearches([])
  }, [namespace])

  return { recentSearches, addSearch, clearSearches }
}
