# `useSearch` hook

The `useSearch` hook provides a simple interface for executing searches, managing loading and error states, and resetting search results. It leverages the Orama search client and gives access to the chat context and dispatch function.

---

## Usage

```tsx
import { useSearch } from "@orama/ui/hooks";

const { onSearch, onReset, loading, error, context, dispatch } = useSearch();

onSearch({ term: "example", groupBy: "category" });
```

---

## API

### Return Value

The hook returns an object with the following properties:

| Name     | Type                                                                                                   | Description                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| onSearch | `(options: SearchParams & { groupBy?: string; filterBy?: Record<string, string>[] }) => Promise<void>` | Executes a search with the specified parameters.                             |
| onReset  | `() => void`                                                                                           | Resets the search state to its initial values.                               |
| context  | `ReturnType<typeof useSearchContext>`                                                                  | The current search context, providing access to the search client and state. |
| dispatch | `ReturnType<typeof useSearchDispatch>`                                                                 | Function to dispatch actions to the search state management.                 |
| loading  | `boolean`                                                                                              | Indicates if a search operation is in progress.                              |
| error    | `Error \| null`                                                                                        | The current error state, if any.                                             |

---

### `onSearch(options)`

Executes a search with the provided options.

> **Note:** If you are using the `SearchInput` component from Orama UI, it already integrates and calls this `onSearch` function for you. You only need to use `onSearch` directly if you are building a custom search UI.

#### Parameters

- Accepts all standard Orama search parameters.
- **Additional options:**
  - `groupBy` (string, optional): Field to group results by.
  - `filterBy` (Record<string, string>[], optional): Array of filters to apply.

---

#### Example

```tsx
onSearch({
  term: "react",
  groupBy: "category",
  filterBy: [{ status: "active" }],
});
```

---

### `onReset()`

Resets the search state, clearing results, filters, and errors.

---

### `context`

The current search context, providing access to the search client and other state. Useful for advanced integrations.

---

### `dispatch`

Function to dispatch actions to the search state management. Useful for custom state updates.

---

### `loading`

A boolean indicating if a search is currently in progress.

---

### `error`

An `Error` object or `null` representing the current error state.

---

## Implementation Notes

- Uses React context for state management.
- Handles grouping and filtering of search results.
- Ensures state updates only occur while the component is mounted.
- Automatically manages loading and error states.

---

## Example

```tsx
const { onSearch, onReset, loading, error, context, dispatch } = useSearch();

const handleSearch = () => {
  onSearch({ term: "example", groupBy: "category" });
};

return (
  <div>
    <button onClick={handleSearch} disabled={loading}>
      Search
    </button>
    {error && <span>{error.message}</span>}
    <button onClick={onReset}>Reset</button>
  </div>
);
```
