# `SearchRoot` component

The `SearchRoot` component provides the context and state management for Orama search operations in your React application. It should wrap all search-related UI components to ensure they have access to the search state and dispatch functions.

---

## Purpose

- Initializes and provides the search state and dispatch context.
- Accepts a custom Orama `client` instance.
- Ensures all child components can access and update the search state.

---

## Props

| Name           | Type                                     | Default | Description                                                                                           |
| -------------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `client`       | `OramaCloud`                             | —       | **Required.** Orama client instance for search operations.                                            |
| `children`     | `React.ReactNode`                        | —       | Components that will have access to the search context.                                               |
| `initialState` | `Partial<SearchContextProps>` (optional) | `{}`    | Initial state for the search context. Allows you to configure callbacks and pre-populate search data. |

### initialState Properties

The `initialState` prop accepts a partial `SearchContextProps` object with the following optional properties:s

| Property        | Type                                                                                                  | Description                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `search`        | `(params: SearchParams & { groupBy?: string; filterBy?: Record<string, string>[] }) => Promise<void>` | Custom search callback function to handle search operations.        |
| `searchTerm`    | `string`                                                                                              | Initial search term to pre-populate the search input.               |
| `results`       | `Hit[] \| null`                                                                                       | Array of search results to pre-populate the search results display. |
| `selectedFacet` | `string \| null`                                                                                      | Initially selected facet/filter.                                    |
| `groupsCount`   | `GroupsCount \| null`                                                                                 | Groups count data for faceted search.                               |
| `count`         | `number`                                                                                              | Total number of search results.                                     |

---

## Usage

Wrap your search UI with `SearchRoot` to provide context:

```tsx
import { SearchRoot, SearchInput } from "@orama/ui/components";
import { OramaCloud } from "@orama/core";

const orama = new OramaCloud({
  /* ...config... */
});
```

### Basic Usage

```tsx
<SearchRoot client={orama}>
  <SearchInput.Wrapper>
    <SearchInput.Label htmlFor="search">Search</SearchInput.Label>
    <SearchInput.Input inputId="search" />
  </SearchInput.Wrapper>
  {/* Other search-related components */}
</SearchRoot>
```

### With Custom Search Handler

```tsx
<SearchRoot
  client={orama}
  initialState={{
    search: async (params) => {
      console.log("Searching with params:", params);
      // Custom search logic here
      // You can modify params, add analytics, etc.
    },
  }}
>
  <SearchInput.Wrapper>
    <SearchInput.Label htmlFor="search">Search</SearchInput.Label>
    <SearchInput.Input inputId="search" />
  </SearchInput.Wrapper>
</SearchRoot>
```

### Pre-populating Search State

You can use `initialState` to pre-populate the search with existing data:

```tsx
<SearchRoot
  client={orama}
  initialState={{
    searchTerm: "React components",
    selectedFacet: "documentation",
    results: [
      // Pre-loaded search results
      {
        id: "1",
        document: { title: "Getting Started", content: "..." },
        score: 0.95,
      },
    ],
    count: 42,
  }}
>
  {/* Search UI starts with pre-populated data */}
  <SearchInput.Wrapper>
    <SearchInput.Input inputId="search" />
  </SearchInput.Wrapper>
  <SearchResults />
</SearchRoot>
```

### Complete Example

```tsx
<SearchRoot
  client={orama}
  initialState={{
    search: async (params) => {
      // Analytics tracking
      analytics.track("search_performed", {
        query: params.term,
        filters: params.filterBy,
      });

      // Custom search logic
      console.log("Searching with:", params);
    },
    searchTerm: "Getting started",
    selectedFacet: "All",
    count: 0,
  }}
>
  <SearchInput.Wrapper>
    <SearchInput.Label htmlFor="search">Search Documentation</SearchInput.Label>
    <SearchInput.Input inputId="search" placeholder="Search..." />
  </SearchInput.Wrapper>

  <SearchResults.Wrapper>
    <SearchResults.Hit>
      {(hit) => (
        <div>
          <h3>{hit.document.title}</h3>
          <p>{hit.document.content}</p>
        </div>
      )}
    </SearchResults.Hit>
  </SearchResults.Wrapper>
</SearchRoot>
```

---

## How It Works

- Uses React's `useReducer` to manage search state.
- Provides two contexts:
  - `SearchContext` for accessing the current search state.
  - `SearchDispatchContext` for dispatching actions to update the state.
- The `client` prop is required for search operations.
- The `initialState` prop allows flexible configuration of search behavior and pre-population of data.

## How initialState Works

1. **Flexible Configuration**: The `initialState` prop allows you to configure any aspect of the search context in a single object.

2. **Custom Search Handlers**: You can provide custom `search` callbacks to modify search behavior, add analytics, or integrate with external systems.

3. **Context Inheritance**: All child components automatically inherit the configuration through the search context.

4. **Pre-population**: You can pre-populate the search with existing terms, results, facet selections, or other state data.

5. **Partial Updates**: Since `initialState` accepts a partial object, you only need to specify the properties you want to configure.

---

## Notes

- All components that need to access or update the search state must be descendants of `SearchRoot`.
- The `client` prop is required and must be a valid `OramaCloud` instance.
- Use `initialState` to customize search behavior without needing multiple individual props.
- Pre-populating search state is useful for implementing features like saved searches or deep-linking to search results.
