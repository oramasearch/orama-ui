# `SearchResults` Component

The `SearchResults` component is a collection of composable React components for displaying search results, supporting grouping, custom rendering, and accessibility. It is designed to work with the Orama UI search context.

---

## Exports

```tsx
export const SearchResults = {
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

### 1. `<SearchResults.Wrapper>`

**Props:**

- `children: React.ReactNode` – Content to render inside the wrapper.
- `className?: string` – Optional custom class name.

**Usage:**

```tsx
<SearchResults.Wrapper className="my-wrapper">
  {/* search results here */}
</SearchResults.Wrapper>
```

---

### 2. `<SearchResults.GroupsWrapper>`

Groups results by a field.

**Props:**

- `children: (groupedResult: GroupedResult) => React.ReactNode` – Render function for each group.
- `groupBy: string` – Field name to group by.
- `className?: string` – Optional custom class name.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<SearchResults.GroupsWrapper groupBy="category">
  {(group) => (
    <div>
      <h3>{group.name}</h3>
      <SearchResults.GroupList group={group}>
        {(hit) => <div>{hit.title}</div>}
      </SearchResults.GroupList>
    </div>
  )}
</SearchResults.GroupsWrapper>
```

---

### 3. `<SearchResults.Loading>`

Shows loading state while search is in progress.

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

---

### 4. `<SearchResults.Error>`

Displays error state when search fails.

**Props:**

- `children: (error: Error) => React.ReactNode` – Render function for error state, receives the error object.
- `className?: string` – Optional custom class name.
- `...rest` – Other `div` props.

**Usage:**

```tsx
<SearchResults.Error>
  {(error) => <div>Error: {error.message}</div>}
</SearchResults.Error>
```

**Behavior:**

- Only renders when there is an error from the search context
- Uses `role="alert"` for accessibility to announce errors immediately

---

### 5. `<SearchResults.NoResults>`

Renders when there are no results.

**Props:**

- `children: (searchTerm: string) => React.ReactNode` – Render function for empty state.
- `className?: string` – Optional custom class name.

**Usage:**

```tsx
<SearchResults.NoResults>
  {(term) => <div>No results for "{term}"</div>}
</SearchResults.NoResults>
```

---

### 6. `<SearchResults.List>`

Renders a list of results.

**Props:**

- `children: (result: Hit, index: number) => React.ReactNode` – Render function for each result.
- `className?: string` – Optional class for the `<ul>`.
- `itemClassName?: string` – Optional class for each `<li>`.
- `emptyMessage?: string` – (Unused in code.)

**Usage:**

```tsx
<SearchResults.List>{(result) => <div>{result.title}</div>}</SearchResults.List>
```

---

### 7. `<SearchResults.GroupList>`

Renders a list of results within a group.

**Props:**

- `children: (result: Hit, index: number) => React.ReactNode` – Render function for each result.
- `group: GroupedResult` – The group to render.
- `className?: string` – Optional class for the `<ul>`.
- `itemClassName?: string` – Optional class for each `<li>`.

**Usage:**

```tsx
<SearchResults.GroupList group={group}>
  {(hit) => <div>{hit.title}</div>}
</SearchResults.GroupList>
```

---

### 8. `<SearchResults.Item>`

Renders a single result item, optionally as a custom element.

**Props:**

- `as?: React.ElementType` – Element/component to render as (default: `"div"`).
- `onClick?: (result: Hit) => void` – Click handler.
- `children?: React.ReactNode` – Content.
- `className?: string` – Optional class name.
- `...props` – Other props for the rendered element.

**Usage:**

```tsx
<SearchResults.Item as="a" href={result.url}>
  {result.title}
</SearchResults.Item>
```

---

## Example

```tsx
<SearchResults.Wrapper>
  <SearchResults.Loading>
    <div>Searching...</div>
  </SearchResults.Loading>
  <SearchResults.Error>
    {(error) => <div>Error: {error.message}</div>}
  </SearchResults.Error>
  <SearchResults.NoResults>
    {(term) => <div>No results for "{term}"</div>}
  </SearchResults.NoResults>
  <SearchResults.List>
    {(result) => <SearchResults.Item>{result.title}</SearchResults.Item>}
  </SearchResults.List>
</SearchResults.Wrapper>
```
