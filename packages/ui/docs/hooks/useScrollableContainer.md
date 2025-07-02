# `useScrollableContainer` Hook

A React hook for managing scrollable containers, providing logic for chat "Go to Bottom" button visibility, smooth scrolling, and scroll state management.

## Usage

```tsx
import { useScrollableContainer } from "@orama/ui/hooks";

function MyComponent() {
  const {
    containerRef,
    showGoToBottomButton,
    scrollToBottom,
    isScrolling,
    lockScrollOnBottom,
    setLockScrollOnBottom,
    recalculateGoToBottomButton,
  } = useScrollableContainer({
    onScrollToBottom: () => {
      /* called after scroll to bottom */
    },
    onGoToBottomButtonChange: (show) => {
      /* called when button visibility changes */
    },
  });

  return (
    <div ref={containerRef} style={{ overflowY: "auto", maxHeight: 400 }}>
      {/* ...content... */}
      {showGoToBottomButton && (
        <button onClick={() => scrollToBottom()}>Go to Bottom</button>
      )}
    </div>
  );
}
```

## API

### Arguments

- `onScrollToBottom?: () => void`
  - Callback fired after scrolling to the bottom (manual or animated).
- `onGoToBottomButtonChange?: (show: boolean) => void`
  - Callback fired when the "Go to Bottom" button visibility changes.

### Returns

- `containerRef: (node: HTMLDivElement | null) => void`
  - Ref callback to attach to your scrollable container.
- `containerElement: HTMLDivElement | null`
  - The current container DOM element.
- `showGoToBottomButton: boolean`
  - Whether the "Go to Bottom" button should be shown.
- `scrollToBottom: (options?: { animated?: boolean; onScrollDone?: () => void }) => void`
  - Scrolls to the bottom of the container. Supports smooth animation.
- `isScrolling: boolean`
  - True while an animated scroll is in progress.
- `lockScrollOnBottom: boolean`
  - True if the scroll is locked at the bottom.
- `setLockScrollOnBottom: (lock: boolean) => void`
  - Manually set the lock state.
- `recalculateGoToBottomButton: () => void`
  - Manually recalculate the button visibility (useful after dynamic content changes).

## Features

- Detects if the container is overflowing and manages button visibility.
- Handles smooth animated scrolling to the bottom.
- Exposes scroll state and lock controls.
- Automatically updates on resize and wheel events.
