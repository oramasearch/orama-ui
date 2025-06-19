# `SearchContext`

The `SearchContext` provides state and dispatch for managing search operations in your React application using Orama. It supplies the current search state (such as client, search term, results, facets, and counts) and a dispatch function to update this state.

This context is typically used to wrap parts of your UI that require access to search functionality, such as search inputs, results, and facet controls.

> **Note:**  
> The use of this context is **not required** when using the `SearchRoot` component, as `SearchRoot` manages search state internally.  
> Use this context for custom implementations or advanced use cases where you need direct control over search state management.

---

## Exports

- **`SearchContext`**: The main React context for search state.
- **`SearchDispatchContext`**: Context for dispatching search actions.
- **`useSearchContext`**: Hook to access search state.
- **`useSearchDispatch`**: Hook to dispatch search actions.
- **`searchReducer`**: Reducer function for search state management.
- **`initialSearchState`**: Default search state.

---

## Props & Types

```ts
type SearchContextProps = {
  client: CollectionManager | null;
  onSearch?: (
    params: SearchParams & {
      groupBy?: string;
      filterBy?: Record<string, string>[];
    },
  ) => Promise<void>;
  searchTerm?: string;
  results?: Hit[] | null;
  selectedFacet?: string | null;
  groupsCount?: GroupsCount | null;
  count?: number;
}
```

---

## Usage

### With Custom Provider

```tsx
import { SearchContext, SearchDispatchContext, useSearchContext, useSearchDispatch, searchReducer, initialSearchState } from "@orama/ui/context";
import { CollectionManager } from "@orama/core";

const collectionManager = new CollectionManager({ /* ...config... */ });

function SearchProvider({ children }) {
  const [state, dispatch] = React.useReducer(searchReducer, {
    ...initialSearchState,
    client: collectionManager,
  });

  return (
    <SearchContext value={state}>
      <SearchDispatchContext value={dispatch}>
        {children}
      </SearchDispatchContext>
    </SearchContext>
  );
}
```

### Accessing State and Dispatch

```tsx
import { useSearchContext, useSearchDispatch } from '@orama/ui/context';

function MyComponent() {
  const searchState = searchState();
  const dispatch = useSearchDispatch();

  // Example: Set a new user prompt
  function doSomething {
    // some code here...
    dispatch({ type: 'SET_SEARCH_TERM', payload: { userPrompt: 'Q2 metrics' })
  }

  return <div>{chatState.userPrompt}</div>;
}
```

---

## Actions

- `SET_CLIENT`
- `SET_SEARCH_TERM`
- `SET_RESULTS`
- `SET_GROUPS_COUNT`
- `SET_SELECTED_FACET`
- `SET_COUNT`

---