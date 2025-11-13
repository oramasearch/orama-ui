# `RecentSearches` Component

A compound component for displaying and managing recent search queries with automatic persistence and language-aware filtering.

## Features

- Displays recent search terms from localStorage
- Automatically filters out stopwords and short terms
- Supports both regular search and NLP search modes
- Customizable styling and behavior
- Context-based state management
- Accessibility support with ARIA attributes
- **Works out of the box when used with Orama `SearchInput.Form` or `SearchInput.Input` components**

## Basic Usage

```tsx
import { RecentSearches } from '@/components/RecentSearches'

function SearchInterface() {
  return (
    <RecentSearches.Provider 
      onSearch={(query) => console.log('Searched:', query)}
      onClear={() => console.log('Cleared recent searches')}
    >
      <RecentSearches.List className="recent-list">
        {(term, index) => (
          <RecentSearches.Item term={term} className="recent-item">
            {term}
          </RecentSearches.Item>
        )}
      </RecentSearches.List>
      
      <RecentSearches.Clear className="clear-btn">
        Clear All
      </RecentSearches.Clear>
    </RecentSearches.Provider>
  )
}
```

## Advanced Usage

```tsx
import { RecentSearches } from '@/components/RecentSearches'

function AdvancedSearchInterface() {
  const handleSearch = (query: string) => {
    // Additional logic
    doSomething(query)
  }

  return (
    <RecentSearches.Provider onSearch={handleSearch}>
      <div className="search-history">
        <h3>Recent Searches</h3>
        
        <RecentSearches.List 
          className="grid grid-cols-2 gap-2"
          itemClassName="recent-search-item"
        >
          {(term, index) => (
            <RecentSearches.Item 
              term={term}
              mode="nlp"
              searchParams={{ limit: 20, offset: 0 }}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <span className="text-sm">{term}</span>
              <span className="text-xs text-gray-500">#{index + 1}</span>
            </RecentSearches.Item>
          )}
        </RecentSearches.List>
        
        <RecentSearches.Clear className="mt-4 text-red-500 underline">
          Clear History
        </RecentSearches.Clear>
      </div>
    </RecentSearches.Provider>
  )
}
```

## API Reference

### RecentSearches.Provider

The root component that provides context and manages recent searches state.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `onSearch` | `(query: string) => void` | Optional callback fired when a recent search item is clicked |
| `onClear` | `() => void` | Optional callback fired when clear button is clicked |
| `children` | `React.ReactNode` | Child components |

#### Behavior

- Uses `useSearchContext` to get language and namespace settings
- Uses `useRecentSearches` hook for state management
- Renders `null` if no recent searches exist
- Provides context to child components

### RecentSearches.List

Renders the list of recent searches using a render prop pattern.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `(term: string, index: number) => React.ReactNode` | Render function for each search term |
| `className` | `string` | CSS class for the `<ul>` element |
| `itemClassName` | `string` | CSS class applied to each `<li>` element |
| `...rest` | `React.HTMLAttributes<HTMLUListElement>` | Additional props passed to the `<ul>` element |

#### Features

- Renders as semantic `<ul>` with `aria-live="polite"` for accessibility
- Returns `null` if no searches available
- Passes term string and index to render function

### RecentSearches.Item

Interactive button component for individual search terms.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `term` | `string` | Required | The search term to display and execute |
| `children` | `React.ReactNode` | Optional | Content to display (defaults to term) |
| `onClick` | `() => void` | Optional | Additional click handler |
| `className` | `string` | Optional | CSS class for styling |
| `mode` | `'search' \| 'nlp'` | `'search'` | Search mode to use |
| `searchParams` | `SearchParams` | Optional | Additional search parameters |
| `...rest` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | - | Additional button props |

#### Behavior

- Triggers search using `useSearch` hook
- Calls `onSearch` callback from Provider
- Supports both regular and NLP search modes
- Passes additional search parameters when provided

### RecentSearches.Clear

Button component for clearing all recent searches.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | `'Clear'` | Button content |
| `className` | `string` | Optional | CSS class for styling |
| `onClick` | `() => void` | Optional | Additional click handler |
| `...rest` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | - | Additional button props |

#### Behavior

- Calls `clearSearches` from the hook
- Calls `onClear` callback from Provider
- Renders `null` if no recent searches exist
- Removes all searches from localStorage and state

## Types

```tsx
type OnSearch = (query: string) => void
type OnClear = () => void

interface RecentSearch {
  term: string
  timestamp: number
}

interface SearchParams {
  limit?: number
  offset?: number
  // ... other search parameters
}
```

## Integration

The component integrates with:

- **SearchContext**: For language and namespace configuration
- **useRecentSearches**: For persistence and state management  
- **useSearch**: For executing searches when items are clicked

### Namespace Configuration

Recent searches are automatically scoped by namespace to isolate different search contexts. The namespace is inherited from the `SearchRoot` provider:

```tsx
import { SearchRoot, RecentSearches } from '@/components'

// Different namespaces create separate search histories
function ProductSearch() {
  return (
    <SearchRoot namespace="products">
      <RecentSearches.Provider>
        {/* This will save searches under "recent_searches_products" */}
        <RecentSearches.List>
          {(term) => <RecentSearches.Item term={term}>{term}</RecentSearches.Item>}
        </RecentSearches.List>
      </RecentSearches.Provider>
    </SearchRoot>
  )
}

function DocumentSearch() {
  return (
    <SearchRoot namespace="documents">
      <RecentSearches.Provider>
        {/* This will save searches under "recent_searches_documents" */}
        <RecentSearches.List>
          {(term) => <RecentSearches.Item term={term}>{term}</RecentSearches.Item>}
        </RecentSearches.List>
      </RecentSearches.Provider>
    </SearchRoot>
  )
}
```

**Important**: If you want to maintain separate recent search histories for different search contexts (e.g., product search vs. document search), you must provide a unique `namespace` prop to the `SearchRoot` component. Without a namespace, all searches will be stored under the default `recent_searches` key.

## Accessibility

- Uses semantic HTML (`<ul>`, `<li>`, `<button>`)
- Includes `aria-live="polite"` on the list for screen readers
- Proper button semantics for interactive elements
- Keyboard navigation support through native button behavior

## Styling

Components accept `className` props for custom styling:

```tsx
<RecentSearches.List 
  className="flex flex-wrap gap-2" 
  itemClassName="inline-block"
>
  {(term) => (
    <RecentSearches.Item 
      term={term}
      className="px-3 py-1 bg-blue-100 rounded-full text-sm hover:bg-blue-200 transition-colors"
    >
      {term}
    </RecentSearches.Item>
  )}
</RecentSearches.List>
```