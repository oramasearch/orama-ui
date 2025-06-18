# `SearchRoot` Component

The `SearchRoot` component provides the context and state management for Orama search operations in your React application. It should wrap all search-related UI components to ensure they have access to the search state and dispatch functions.

---

## Purpose

- Initializes and provides the search state and dispatch context.
- Accepts a custom Orama `client` instance.
- Ensures all child components can access and update the search state.

---

## Props

| Name      | Type                | Default | Description                                                                 |
|-----------|---------------------|---------|-----------------------------------------------------------------------------|
| `client`  | `CollectionManager` | —       | (Optional) Orama client instance for search operations.                     |
| `children`| `React.ReactNode`   | —       | Components that will have access to the search context.                     |

---

## Usage

Wrap your search UI with `SearchRoot` to provide context:

```tsx
import SearchRoot from "@orama/ui/components/SearchRoot";
import SearchInput from "@orama/ui/components/components/SearchInput";
import { CollectionManager } from "@orama/core";

const collectionManager = new CollectionManager({ /* ...config... */ });
```

```tsx
  <SearchRoot client={myOramaClient}>
    <SearchInput.Wrapper>
      <SearchInput.Label htmlFor="search">Search</SearchInput.Label>
      <SearchInput.Input inputId="search" />
    </SearchInput.Wrapper>
    {/* Other search-related components */}
  </SearchRoot>
```

---

## How It Works

- Uses React's `useReducer` to manage search state.
- Provides two contexts:
  - `SearchContext` for accessing the current search state.
  - `SearchDispatchContext` for dispatching actions to update the state.
- `client` prop is mandatory.

---

## Notes

- All components that need to access or update the search state must be descendants of `SearchRoot`.
- The Orama `client` is required for search operations; provide it via props or context.

---

**See the source code for advanced usage and customization.**