# `SearchRoot` component

The `SearchRoot` component provides the context and state management for Orama search operations in your React application. It should wrap all search-related UI components to ensure they have access to the search state and dispatch functions.

---

## Purpose

- Initializes and provides the search state and dispatch context.
- Accepts a custom Orama `client` instance.
- Ensures all child components can access and update the search state.
- Supports language-specific search behavior and namespaced contexts.

---

## Props

| Name           | Type                                     | Default | Description                                                                                                                       |
| -------------- | ---------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `client`       | `OramaCloud`                             | —       | **Required.** Orama client instance for search operations.                                                                        |
| `children`     | `React.ReactNode`                        | —       | Components that will have access to the search context.                                                                           |
| `lang`         | `Lang` (optional)                        | —       | Language for the search context. Helps tailor search behavior and results to the specified language.                              |
| `searchParams` | `SearchParams`                           | —       | Default search parameters including grouping and filtering options.                                                               |
| `namespace`    | `string` (optional)                      | —       | Namespace for the search context. Allows for scoping recent searches and other context-specific data. Default value is `english`. |
| `initialState` | `Partial<SearchContextProps>` (optional) | `{}`    | Initial state for the search context. Allows you to configure callbacks and pre-populate search data.                             |

### initialState Properties

The `initialState` prop accepts a partial `SearchContextProps` object with the following optional properties:

| Property        | Type                  | Description                                                         |
| --------------- | --------------------- | ------------------------------------------------------------------- |
| `searchTerm`    | `string`              | Initial search term to pre-populate the search input.               |
| `results`       | `Hit[] \| null`       | Array of search results to pre-populate the search results display. |
| `selectedFacet` | `string \| null`      | Initially selected facet/filter.                                    |
| `groupsCount`   | `GroupsCount \| null` | Groups count data for faceted search.                               |
| `count`         | `number`              | Total number of search results.                                     |

---

## Usage

Wrap your search UI with `SearchRoot` to provide context:

```tsx
import { SearchRoot, SearchInput } from "@orama/ui/components";
import { OramaCloud } from "@orama/core";

const orama = new OramaCloud({
  projectId: "your-project-id",
  apiKey: "your-api-key",
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

### With Custom Search Parameters

```tsx
<SearchRoot
  client={orama}
  searchParams={{
    limit: 20,
    offset: 0,
  }}
  lang="en"
  namespace="my-app"
>
  <SearchInterface />
</SearchRoot>
```

The `searchParams` prop defines default search parameters that will be used by all search operations within the SearchRoot context. These parameters serve as the baseline configuration for any component that triggers a search.

**Key Behavior:**

- **Global Defaults**: All components calling `search()` will automatically use these parameters as defaults
- **Component Override**: Individual components can override these defaults by passing their own parameters
- **Parameter Merging**: When overriding, the component-specific parameters are merged with (and take precedence over) the SearchRoot defaults

### With Language Support

```tsx
<SearchRoot client={orama} lang="italian">
  <SearchInput.Wrapper>
    <SearchInput.Label htmlFor="search">Cerca...</SearchInput.Label>
    <SearchInput.Input inputId="search" />
  </SearchInput.Wrapper>
</SearchRoot>
```

### With Namespace for Scoped Context

```tsx
<SearchRoot client={orama} namespace="documentation">
  <SearchInput.Wrapper>
    <SearchInput.Label htmlFor="search">Search Documentation</SearchInput.Label>
    <SearchInput.Input inputId="search" />
  </SearchInput.Wrapper>
</SearchRoot>
```

### Multiple Search Contexts with Namespaces

```tsx
{
  /* Product search context */
}
<SearchRoot client={orama} namespace="products" lang="en">
  <ProductSearch />
</SearchRoot>;

{
  /* Documentation search context */
}
<SearchRoot client={orama} namespace="docs" lang="en">
  <DocumentationSearch />
</SearchRoot>;
```

### With Custom Search Handler

```tsx
<SearchRoot
  client={orama}
  lang="es"
  namespace="blog"
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
  lang="fr"
  namespace="products"
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
  lang="en"
  namespace="help-center"
  initialState={{
    search: async (params) => {
      // Analytics tracking
      analytics.track("search_performed", {
        query: params.term,
        filters: params.filterBy,
        namespace: "help-center",
        language: "en",
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
- The `lang` prop configures language-specific search behavior.
- The `namespace` prop allows for scoped contexts, useful for separating different search areas.
- The `initialState` prop allows flexible configuration of search behavior and pre-population of data.

## How Props Work

### Language (`lang`)

The `lang` prop helps tailor search behavior and results to a specific language:

- Influences search algorithms and result ranking
- Can affect tokenization and stemming
- Useful for multi-language applications

### Namespace (`namespace`)

The `namespace` prop allows for scoping search contexts:

- Separates recent searches between different search areas
- Enables multiple independent search contexts in the same application
- Useful for apps with different search domains (e.g., products vs. documentation)

### Initial State (`initialState`)

1. **Flexible Configuration**: The `initialState` prop allows you to configure any aspect of the search context in a single object.

2. **Custom Search Handlers**: You can provide custom `search` callbacks to modify search behavior, add analytics, or integrate with external systems.

3. **Context Inheritance**: All child components automatically inherit the configuration through the search context.

4. **Pre-population**: You can pre-populate the search with existing terms, results, facet selections, or other state data.

5. **Partial Updates**: Since `initialState` accepts a partial object, you only need to specify the properties you want to configure.

---

## Notes

- All components that need to access or update the search state must be descendants of `SearchRoot`.
- The `client` prop is required and must be a valid `OramaCloud` instance.
- Use `lang` to configure language-specific search behavior for better results.
- Use `namespace` to create scoped search contexts when you need multiple independent search areas.
- Use `initialState` to customize search behavior without needing multiple individual props.
- Pre-populating search state is useful for implementing features like saved searches or deep-linking to search results.
- `SearchRoot` components can be nested, with child contexts inheriting from parent contexts when props are not explicitly provided.
