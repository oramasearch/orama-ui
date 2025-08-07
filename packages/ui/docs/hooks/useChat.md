# `useChat` hook

The `useChat` hook provides a set of utilities for managing chat interactions in Orama-powered React applications. It handles sending prompts, streaming answers, aborting and regenerating responses, resetting the chat session, and gives access to the chat context and dispatch function.

---

## Usage

### Basic Usage (Using ChatRoot Callbacks)

```tsx
import { useChat } from "@orama/ui/hooks";

function MyChatComponent() {
  // Uses callbacks defined at ChatRoot level
  const { ask, loading, error, context, dispatch } = useChat();

  const handleSubmit = (query: string) => {
    ask({ query });
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {/* Chat UI */}
    </div>
  );
}
```

### Advanced Usage (With Hook-Level Callbacks)

```tsx
import { useChat } from "@orama/ui/hooks";

function MyChatComponent() {
  const { ask, loading, error, context, dispatch } = useChat({
    onAskStart: (options) => {
      console.log("Starting chat with query:", options.query);
      // Component-specific start logic
    },
    onAskComplete: () => {
      console.log("Chat completed successfully");
      // Component-specific completion logic
    },
    onAskError: (error) => {
      console.error("Chat failed:", error);
      // Component-specific error handling
    },
  });

  const handleSubmit = (query: string) => {
    ask({ query });
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {/* Chat UI */}
    </div>
  );
}
```

---

## API

### Callbacks

You can pass an optional callbacks object to `useChat` to hook into the ask lifecycle. These callbacks have a priority system with callbacks passed to the `ChatRoot` component:

| Name            | Type                              | Description                                            |
| --------------- | --------------------------------- | ------------------------------------------------------ |
| `onAskStart`    | `(options: AnswerConfig) => void` | Called when `ask` starts, receives the prompt options. |
| `onAskComplete` | `() => void`                      | Called when `ask` completes successfully.              |
| `onAskError`    | `(error: Error) => void`          | Called when `ask` fails, receives the error object.    |

#### Callback Priority

The `useChat` hook implements a callback priority system:

1. **Hook-level callbacks** (passed directly to `useChat`) take precedence
2. **ChatRoot-level callbacks** (passed to `ChatRoot` component) are used as fallbacks

This means if you provide both hook-level and ChatRoot-level callbacks, only the hook-level callbacks will be executed.

### Returns

| Name               | Type                                       | Description                                          |
| ------------------ | ------------------------------------------ | ---------------------------------------------------- |
| `ask`              | `(options: AnswerConfig) => Promise<void>` | Sends a user prompt and handles the answer stream.   |
| `abort`            | `() => void`                               | Aborts the current answer stream.                    |
| `regenerateLatest` | `() => void`                               | Regenerates the latest answer.                       |
| `reset`            | `() => void`                               | Resets the chat session and clears interactions.     |
| `context`          | `ReturnType<typeof useChatContext>`        | The chat context containing client and session info. |
| `dispatch`         | `ReturnType<typeof useChatDispatch>`       | Function to dispatch actions to the chat state.      |
| `loading`          | `boolean`                                  | Indicates if a request is in progress.               |
| `error`            | `Error \| null`                            | Error object if an error occurred, otherwise `null`. |

---

## When to Use Callbacks

### ChatRoot-level Callbacks (Recommended for Global Behavior)

Use callbacks at the `ChatRoot` level when you want consistent behavior across all chat interactions in your application:

```tsx
import { ChatRoot } from "@orama/ui/components";
import { OramaCloud } from "@orama/core";

function App() {
  const orama = new OramaCloud({
    /* ...config... */
  });

  return (
    <ChatRoot
      client={orama}
      onAskStart={(options) => {
        // Global analytics tracking
        analytics.track("chat_question_started", { query: options.query });
      }}
      onAskComplete={() => {
        // Global success tracking
        analytics.track("chat_question_completed");
      }}
      onAskError={(error) => {
        // Global error handling and logging
        console.error("Chat error:", error);
        errorService.log(error);
      }}
    >
      <MyChatInterface />
    </ChatRoot>
  );
}

function MyChatInterface() {
  // Uses ChatRoot-level callbacks automatically
  const { ask, loading, error } = useChat();

  return <div>{/* Chat UI components */}</div>;
}
```

### Hook-level Callbacks (For Component-Specific Behavior)

Use callbacks at the hook level when you need specific behavior for individual components or want to override global behavior:

```tsx
function SpecialChatComponent() {
  const { ask, loading, error } = useChat({
    onAskStart: (options) => {
      // Component-specific behavior that overrides ChatRoot callbacks
      setCustomLoadingState(true);
      showTypingIndicator();
    },
    onAskComplete: () => {
      // Custom completion logic for this component only
      setCustomLoadingState(false);
      hideTypingIndicator();
      scrollToBottom();
    },
    onAskError: (error) => {
      // Component-specific error handling
      setCustomLoadingState(false);
      showCustomErrorMessage(error.message);
    },
  });

  return <div>{/* Special chat UI with custom behavior */}</div>;
}
```

### Mixed Approach

You can also use both approaches together. Hook-level callbacks will override ChatRoot-level callbacks, allowing you to have global defaults with component-specific overrides:

```tsx
// Global setup with ChatRoot callbacks for analytics
<ChatRoot
  client={orama}
  onAskStart={(options) => analytics.track("chat_started", options)}
  onAskComplete={() => analytics.track("chat_completed")}
  onAskError={(error) =>
    analytics.track("chat_error", { error: error.message })
  }
>
  {/* Regular chat component uses global callbacks */}
  <RegularChatComponent />

  {/* Special component overrides with its own callbacks */}
  <SpecialChatComponent />
</ChatRoot>
```

### Best Practices

- **Use ChatRoot callbacks** for:
  - Analytics and tracking
  - Global error handling and logging
  - Consistent user experience patterns
  - Application-wide state management

- **Use hook callbacks** for:
  - Component-specific UI updates
  - Custom loading states
  - Specialized error handling
  - Overriding global behavior for specific use cases

---

## Notes

- Throws errors if required dependencies (like answer session or client) are not initialized.
- Designed to be used within a [`ChatRoot`](../components/ChatRoot.md) or custom chat provider using [`ChatContext`](../context/ChatContext.md).
- Hook-level callbacks take precedence over [`ChatRoot`](../components/ChatRoot.md) callbacks when both are provided.
- The hook automatically handles the callback priority system, so you don't need to worry about manually managing which callbacks to call.

---
