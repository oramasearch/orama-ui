# `useChat` hook

The `useChat` hook provides a set of utilities for managing chat interactions in Orama-powered React applications. It handles sending prompts, streaming answers, aborting and regenerating responses, resetting the chat session, and gives access to the chat context and dispatch function.

---

## Usage

```tsx
import { useChat } from "@orama/ui/hooks";

function MyChatComponent() {
  const { ask, loading, error, context, dispatch } = useChat({
    onAskStart: (options) => {
      // Called when ask starts
    },
    onAskComplete: () => {
      // Called when ask completes successfully
    },
    onAskError: (error) => {
      // Called when ask fails
    },
  });

  // Example usage
  // ask({ query: "Hello, Orama!" });
}
```

---

## API

### Callbacks

You can pass an optional callbacks object to `useChat` to hook into the ask lifecycle:

| Name            | Type                              | Description                                            |
| --------------- | --------------------------------- | ------------------------------------------------------ |
| `onAskStart`    | `(options: AnswerConfig) => void` | Called when `ask` starts, receives the prompt options. |
| `onAskComplete` | `() => void`                      | Called when `ask` completes successfully.              |
| `onAskError`    | `(error: Error) => void`          | Called when `ask` fails, receives the error object.    |

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

## Notes

- Throws errors if required dependencies (like answer session or client) are not initialized.
- Designed to be used within a [`ChatRoot`](../components/ChatRoot.md) or custom chat provider using [`ChatContext`](../context/ChatContext.md).

---
