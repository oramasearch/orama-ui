# `ChatRoot`

The `ChatRoot` component provides the context and state management for Orama chat operations in your React application. It uses a reducer to manage chat-related state and provides both the state and dispatch function to its descendants via context.

This component is typically used to wrap parts of your UI that require access to chat functionality, such as sending messages, receiving responses, and interacting with the Orama client.

## Props

| Name    | Type                        | Description                                                                                       |
|---------|-----------------------------|---------------------------------------------------------------------------------------------------|
| client  | `CollectionManager` (optional) | The Orama client instance to be used for chat operations. If not provided, uses context fallback. |
| children| `React.ReactNode`           | The child components that will have access to the chat context.                                   |

## Usage

```tsx
import ChatRoot from "@orama/ui/components/ChatRoot";
import { CollectionManager } from "@orama/core";

const collectionManager = new CollectionManager({ /* ...config... */ });
```

```tsx
<ChatRoot client={collectionManager}>
  {/* Chat-related components go here */}
</ChatRoot>
```