# `ChatRoot`

The `ChatRoot` component provides the context and state management for Orama chat operations in your React application. It uses a reducer to manage chat-related state and provides both the state and dispatch function to its descendants via context.

This component is typically used to wrap parts of your UI that require access to chat functionality, such as sending messages, receiving responses, and interacting with the Orama client.

## Props

| Name           | Type                                    | Description                                                                                    |
| -------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| client         | `CollectionManager`                     | The Orama client instance to be used for chat operations.                                      |
| children       | `React.ReactNode`                       | The child components that will have access to the chat context.                                |
| onAskStart     | `(options: AnswerConfig) => void` (optional) | Callback function triggered when a chat request starts. Receives the answer configuration.     |
| onAskComplete  | `() => void` (optional)                 | Callback function triggered when a chat request completes successfully.                        |
| onAskError     | `(error: Error) => void` (optional)    | Callback function triggered when a chat request encounters an error. Receives the error object.|

## Usage

```tsx
import { ChatRoot } from "@orama/ui/components";
import { CollectionManager } from "@orama/core";

const collectionManager = new CollectionManager({
  /* ...config... */
});
```

### Basic Usage

```tsx
<ChatRoot client={collectionManager}>
  {/* Chat-related components go here */}
</ChatRoot>
```

### With Event Handlers

```tsx
<ChatRoot 
  client={collectionManager}
  onAskStart={(options) => {
    console.log('Chat request started with options:', options);
  }}
  onAskComplete={() => {
    console.log('Chat request completed successfully');
  }}
  onAskError={(error) => {
    console.error('Chat request failed:', error);
  }}
>
  {/* Chat-related components go here */}
</ChatRoot>
```
