# `useChat`

The `useChat` hook provides a set of utilities for managing chat interactions in Orama-powered React applications. It handles sending prompts, streaming answers, aborting and regenerating responses, copying messages to the clipboard, and resetting the chat session.

---

## Usage

```tsx
import { useChat } from "@orama/ui/hooks";

function MyChatComponent() {
  const { onAsk, loading, error } = useChat();

  // Example usage
  // onAsk({ query: "Hello, Orama!" });
}
```

---

## API

### Returns

| Name               | Type                                       | Description                                            |
| ------------------ | ------------------------------------------ | ------------------------------------------------------ |
| `onAsk`            | `(options: AnswerConfig) => Promise<void>` | Sends a user prompt and handles the answer stream.     |
| `abortAnswer`      | `() => void`                               | Aborts the current answer stream.                      |
| `regenerateLatest` | `() => void`                               | Regenerates the latest answer.                         |
| `copyToClipboard`  | `(message: string) => void`                | Copies a message to the clipboard.                     |
| `copiedMessage`    | `string`                                   | The last message successfully copied to the clipboard. |
| `reset`            | `() => void`                               | Resets the chat session and clears interactions.       |
| `loading`          | `boolean`                                  | Indicates if a request is in progress.                 |
| `error`            | `Error \| null`                            | Error object if an error occurred, otherwise `null`.   |

---

## Notes

- Throws errors if required dependencies (like answer session or client) are not initialized.
- Designed to be used within a [`ChatRoot`](../components/ChatRoot.md) or custom chat provider using [`ChatContext`](../context/ChatContext.md).

---
