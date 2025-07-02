## `useLastInteractionMinHeight` hook

A custom React hook that tracks the minimum height of a container based on its last rendered height and updates it on window resize. Useful for maintaining UI consistency when the number of interactions changes.

### Parameters

- **interactionsLength** (`number`):  
  The number of interactions/items rendered in the container. Used as a dependency to recalculate the minimum height when the content changes.

- **margin** (`number`, optional, default: `32`):  
  An optional margin value. Currently included as a dependency, but not directly used in the logic.

### Returns

- **containerRef** (`React.RefObject<HTMLDivElement>`):  
  A ref to be attached to the container whose height you want to track.

- **minHeight** (`number`):  
  The last measured height of the container, updated on mount and window resize.

### Usage

```tsx
const { containerRef, minHeight } = useLastInteractionMinHeight(
  interactions.length,
);

return (
  <div ref={containerRef} style={{ minHeight }}>
    {/* ...content... */}
  </div>
);
```

### Notes

- The hook recalculates the minimum height whenever `interactionsLength` or `margin` changes, or when the window is resized.
- Make sure to attach `containerRef` to the container you want to measure.
