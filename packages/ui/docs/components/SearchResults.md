# `SearchResults` Component

The `SearchResults` component is a collection of composable React components for displaying search results, supporting grouping, custom rendering, and accessibility. It is designed to work with the Orama UI search context and it supports both regular search and NLP search modes.

---

## Exports

```tsx
export const SearchResults = {
  Provider: SearchResultsProvider,
  Wrapper: SearchResultsWrapper,
  List: SearchResultsList,
  GroupsWrapper: SearchResultsGroupedWrapper,
  GroupList: SearchResultsGroupList,
  Item: SearchResultsItem,
  Loading: SearchResultsLoading,
  Error: SearchResultsError,
  NoResults: SearchResultsNoResults,
};
```

---

## Components

### 1. `<SearchResults.Provider>`

Provides search mode context to child components.

**Props:**

- `children: React.ReactNode` – Child components.
- `mode?: 'search' | 'nlp'` – Search mode (default: `'search'`).

**Usage:**

```tsx
<SearchResults.Provider mode="nlp">
  <SearchResults.Wrapper>
    {/* components will use NLP search data */}
  </SearchResults.Wrapper>
</SearchResults.Provider>
```

---

### 2. `<SearchResults.Wrapper>`

A container component for search results with optional mode support.

**Props:**

- `children: React.ReactNode` – Content to render inside the wrapper.
- `className?: string` – Optional custom class name.
- `mode?: 'search' | 'nlp'` – Search mode. If provided, automatically wraps children in a Provider.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<!-- Simple wrapper -->
<SearchResults.Wrapper className="my-wrapper">
  {/* search results here */}
</SearchResults.Wrapper>

<!-- With mode (automatically provides context) -->
<SearchResults.Wrapper mode="nlp" className="nlp-results">
  {/* components will use NLP search data */}
</SearchResults.Wrapper>
```

---

### 3. `<SearchResults.GroupsWrapper>`

Groups search results by a specified field and renders them with a custom render function.

**Props:**

- `children: (groupedResult: GroupedResult) => React.ReactNode` – Render function for each group.
- `groupBy: string` – Field name to group results by.
- `className?: string` – Optional custom class name.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<SearchResults.GroupsWrapper groupBy="category">
  {(group) => (
    <div>
      <h3>
        {group.name} ({group.count} results)
      </h3>
      <SearchResults.GroupList group={group}>
        {(hit) => <div>{hit.document.title}</div>}
      </SearchResults.GroupList>
    </div>
  )}
</SearchResults.GroupsWrapper>
```

**Behavior:**

- Returns `null` if no results are available
- Uses `role="region"` and `aria-label="Grouped search results"` for accessibility
- Groups are created based on string or number values of the specified field

---

### 4. `<SearchResults.Loading>`

Shows loading state during search operations.

**Props:**

- `children: React.ReactNode` – Content to render during loading.
- `className?: string` – Optional custom class name.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<SearchResults.Loading>
  <div>Searching...</div>
</SearchResults.Loading>
```

**Behavior:**

- Only renders when `loading` is `true` and there are no existing results
- Uses `role="status"` and `aria-live="polite"` for accessibility
- Automatically hides when search completes or if results already exist

---

### 5. `<SearchResults.Error>`

Displays error state when search operations fail.

**Props:**

- `children: (error: Error) => React.ReactNode` – Render function that receives the error object.
- `className?: string` – Optional custom class name.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<SearchResults.Error>
  {(error) => (
    <div>
      <h3>Search Error</h3>
      <p>{error.message}</p>
    </div>
  )}
</SearchResults.Error>
```

**Behavior:**

- Only renders when there is an error from the search context
- Uses `role="alert"` for accessibility to announce errors immediately
- Returns `null` when no error is present

---

### 6. `<SearchResults.NoResults>`

Displays a message when no search results are found.

**Props:**

- `children: (searchTerm: string) => React.ReactNode` – Render function that receives the search term.
- `className?: string` – Optional custom class name.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<SearchResults.NoResults>
  {(term) => (
    <div>
      <h3>No results found</h3>
      <p>No results found for "{term}". Try adjusting your search terms.</p>
    </div>
  )}
</SearchResults.NoResults>
```

**Behavior:**

- Only renders when search is complete, no results exist, and a search term is present
- Uses `aria-live="polite"` for accessibility
- Returns `null` during loading or when results are available
- Handles both "search on type" and "search on submit" scenarios

---

### 7. `<SearchResults.List>`

Renders search results as an unordered list.

**Props:**

- `children: (result: Hit, index: number) => React.ReactNode` – Render function for each result.
- `className?: string` – Optional class for the `<ul>` element.
- `itemClassName?: string` – Optional class for each `<li>` element.
- `...rest` – Other `ul` props.

**Usage:**

```tsx
<SearchResults.List className="results-list" itemClassName="result-item">
  {(result, index) => (
    <div>
      <h4>{result.document.title}</h4>
      <p>{result.document.description}</p>
      <small>Score: {result.score}</small>
    </div>
  )}
</SearchResults.List>
```

**Behavior:**

- Returns `null` if no results are available
- Uses `aria-live="polite"` for accessibility
- Each list item gets a unique key based on `result.id` or fallback index

---

### 8. `<SearchResults.GroupList>`

Renders search results within a specific group as an unordered list.

**Props:**

- `children: (result: Hit, index: number) => React.ReactNode` – Render function for each result.
- `group: GroupedResult` – The group object containing hits to render.
- `className?: string` – Optional class for the `<ul>` element.
- `itemClassName?: string` – Optional class for each `<li>` element.

**Usage:**

```tsx
<SearchResults.GroupList
  group={group}
  className="group-list"
  itemClassName="group-item"
>
  {(hit, index) => (
    <div>
      <h5>{hit.document.title}</h5>
      <p>{hit.document.content}</p>
    </div>
  )}
</SearchResults.GroupList>
```

---

### 9. `<SearchResults.Item>`

A flexible container component for individual search result items.

**Props:**

- `as?: React.ElementType` – Element/component to render as (default: `"div"`).
- `onClick?: (e: React.MouseEvent<HTMLElement>) => void` – Click handler.
- `children?: React.ReactNode` – Content to render.
- `className?: string` – Optional class name.
- `...props` – Other props for the rendered element.

**Usage:**

```tsx
<!-- As a clickable div -->
<SearchResults.Item
  onClick={() => console.log('clicked')}
  className="clickable-result"
>
  {result.document.title}
</SearchResults.Item>

<!-- As a link -->
<SearchResults.Item as="a" href={result.document.url}>
  {result.document.title}
</SearchResults.Item>

<!-- As a button -->
<SearchResults.Item as="button" onClick={() => selectResult(result)}>
  {result.document.title}
</SearchResults.Item>
```

---

## Search Modes

The SearchResults components support two search modes:

- **`'search'`** (default): Uses regular Orama search results
- **`'nlp'`**: Uses NLP search results

Set the mode using either the `Provider` or `Wrapper` component:

```tsx
<!-- Using Provider -->
<SearchResults.Provider mode="nlp">
  <SearchResults.List>
    {(result) => <div>{result.document.title}</div>}
  </SearchResults.List>
</SearchResults.Provider>

<!-- Using Wrapper with mode -->
<SearchResults.Wrapper mode="nlp">
  <SearchResults.List>
    {(result) => <div>{result.document.title}</div>}
  </SearchResults.List>
</SearchResults.Wrapper>
```

---

## Complete Example

```tsx
import { SearchResults } from "@orama/ui-react";

function SearchPage() {
  return (
    <SearchResults.Wrapper className="search-results">
      {/* Loading state */}
      <SearchResults.Loading>
        <div className="loading-spinner">Searching...</div>
      </SearchResults.Loading>

      {/* Error state */}
      <SearchResults.Error>
        {(error) => (
          <div className="error-message">
            <h3>Something went wrong</h3>
            <p>{error.message}</p>
          </div>
        )}
      </SearchResults.Error>

      {/* No results state */}
      <SearchResults.NoResults>
        {(term) => (
          <div className="no-results">
            <h3>No results found</h3>
            <p>No results found for "{term}". Try different keywords.</p>
          </div>
        )}
      </SearchResults.NoResults>

      {/* Results list */}
      <SearchResults.List className="results-list">
        {(result, index) => (
          <SearchResults.Item
            as="a"
            href={result.document.url}
            className="result-card"
          >
            <h4>{result.document.title}</h4>
            <p>{result.document.description}</p>
            <small>Relevance: {Math.round(result.score * 100)}%</small>
          </SearchResults.Item>
        )}
      </SearchResults.List>
    </SearchResults.Wrapper>
  );
}
```

## Grouped Results Example

```tsx
<SearchResults.GroupsWrapper groupBy="category">
  {(group) => (
    <section className="result-group">
      <header>
        <h3>{group.name}</h3>
        <span className="count">{group.count} results</span>
      </header>

      <SearchResults.GroupList group={group}>
        {(hit) => (
          <SearchResults.Item className="grouped-result">
            <h4>{hit.document.title}</h4>
            <p>{hit.document.description}</p>
          </SearchResults.Item>
        )}
      </SearchResults.GroupList>
    </section>
  )}
</SearchResults.GroupsWrapper>
```

---

## Accessibility Features

- **Loading states**: Use `role="status"` and `aria-live="polite"`
- **Error states**: Use `role="alert"` for immediate announcement
- **No results**: Use `aria-live="polite"` for screen reader updates
- **Grouped results**: Use `role="region"` with descriptive labels
- **Semantic HTML**: Proper use of
