# useRecentSearches Hook

A React hook for managing and persisting recent search queries with language-aware stopword filtering.

## Features

- Persists recent searches to localStorage
- Filters out stopwords based on language
- Configurable namespace for multiple search contexts
- Debounced search addition
- Automatic deduplication and ordering by recency

## Usage

```tsx
import { useRecentSearches } from "@/hooks/useRecentSearches";

function SearchComponent() {
  const { recentSearches, addSearch, clearSearches } = useRecentSearches(
    "english",
    "products",
  );

  const handleSearch = (query: string) => {
    // Add search immediately
    addSearch()(query);

    // Or add search with debounce
    addSearch(300)(query);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />

      <div>
        <h3>Recent Searches</h3>
        {recentSearches.map((search) => (
          <div key={search.term}>
            {search.term} - {new Date(search.timestamp).toLocaleString()}
          </div>
        ))}
        <button onClick={clearSearches}>Clear All</button>
      </div>
    </div>
  );
}
```

## API

### Parameters

- `lang` (optional): Language for stopword filtering. Defaults to `'english'`.
  - Supported languages: `arabic`, `english`, `french`, `german`, `italian`, `japanese`, `portuguese`, `russian`, `spanish`, `turkish`, `armenian`, `bulgarian`, `danish`, `dutch`, `finnish`, `greek`, `hungarian`, `indonesian`, `norwegian`, `romanian`, `swedish`, `ukrainian`, `indian`, `irish`, `lithuanian`, `mandarin`, `nepali`, `sanskrit`, `serbian`, `slovenian`, `tamil`
- `namespace` (optional): Storage namespace to isolate searches for different contexts

### Returns

#### `recentSearches: RecentSearch[]`

Array of recent search objects, ordered by most recent first.

```tsx
type RecentSearch = {
  term: string;
  timestamp: number;
};
```

#### `addSearch: (debounceMs?: number) => (term: string) => void`

Function that returns a search handler. Can be used with or without debouncing.

- Without debounce: `addSearch()(term)`
- With debounce: `addSearch(500)(term)` - waits 500ms before adding

#### `clearSearches: () => void`

Removes all recent searches from storage and state.

## Configuration

- **Maximum recent searches**: 10 (configurable via `MAX_RECENT` constant)
- **Minimum term length**: 2 characters (configurable via `MIN_TERM_LENGTH` constant)
- **Storage key**: `recent_searches` (or `recent_searches_{namespace}` when namespace is provided)

## Behavior

1. **Automatic filtering**: Searches shorter than minimum length or matching stopwords are ignored
2. **Deduplication**: Adding an existing search term moves it to the top of the list
3. **Persistence**: Searches are automatically saved to localStorage
4. **Case normalization**: All search terms are converted to lowercase
5. **Trimming**: Leading and trailing whitespace is removed

## Storage

The hook uses localStorage with the following key pattern:

- Default: `recent_searches`
- With namespace: `recent_searches_{namespace}`

Data is stored as JSON array of `RecentSearch
