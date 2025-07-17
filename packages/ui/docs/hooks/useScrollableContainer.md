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

### Chat with Smooth Scroll Behavior

Below is a minimal example showing how to use `useScrollableContainer` with `ChatInteractions.Wrapper` to build a chat UI with smooth scroll-to-bottom behavior.

```tsx
import React, { useEffect } from "react";
import { useScrollableContainer } from "@orama/ui/hooks";
import { ChatInteractions } from "@orama/ui/components";

function ChatBox() {
  const {
    containerRef,
    showGoToBottomButton,
    scrollToBottom,
    recalculateGoToBottomButton,
  } = useScrollableContainer();

  // Automatically scrolls to the bottom when new messages arrive
  useEffect(() => {
    if (interactions.length > 0) {
      scrollToBottom({ animated: true });
    }
    recalculateGoToBottomButton();
  }, [interactions, scrollToBottom, recalculateGoToBottomButton]);

  return (
    <div className='flex'>
      <div>Chatbox header...</div>
      <div ref={containerRef} className="flex-1 overflow-y-auto" >
        <ChatInteractions.Wrapper
          onScroll={recalculateGoToBottomButton}
          onStreaming={recalculateGoToBottomButton}
          onNewInteraction={() => {
            scrollToBottom({ animated: true })
          }}
        >
          {(interaction) => (
            <div className="mb-2">
              <ChatInteractions.AssistantMessage>
                {interaction.response}
              </ChatInteractions.AssistantMessage>
            </div>
          )}
        </ChatInteractions.Wrapper>
      </div>
      <div>Chatbox footer...</div>
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
