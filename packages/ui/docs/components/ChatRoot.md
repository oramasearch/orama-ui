# ChatRoot

The `ChatRoot` component provides context for managing chat state and actions. It serves as the foundation for chat functionality, managing state through a reducer pattern and providing both state and dispatch contexts to child components.

> **Important**: All Orama UI chat components (such as `PromptTextArea`, `ChatInteractions`, `useChat` hook, etc.) must be wrapped within a `ChatRoot` component to function properly. The `ChatRoot` provides the necessary context and state management that these components depend on. If you're building a custom chat implementation, you can create your own context provider, but for standard usage, `ChatRoot` is required.

## Props

| Prop            | Type                                      | Required | Description                                                           |
| --------------- | ----------------------------------------- | -------- | --------------------------------------------------------------------- |
| `client`        | `OramaClient`                             | Yes      | The Orama client instance for chat operations                         |
| `askOptions`    | `Partial<ExtendedAnswerConfig>`           | No       | Default options for ask operations, including throttle_delay          |
| `onAskStart`    | `(options: ExtendedAnswerConfig) => void` | No       | Callback fired when an ask operation starts                           |
| `onAskComplete` | `() => void`                              | No       | Callback fired when an ask operation completes successfully           |
| `onAskError`    | `(error: Error) => void`                  | No       | Callback fired when an ask operation encounters an error              |
| `initialState`  | `Partial<ChatInitialState>`               | No       | Initial state data for the chat context (interactions, prompts, etc.) |
| `children`      | `ReactNode`                               | No       | Child components                                                      |

#### `ExtendedAnswerConfig`

The `askOptions` prop accepts an `ExtendedAnswerConfig` object which extends Orama's `AnswerConfig` with additional UI-specific options:

```tsx
interface ExtendedAnswerConfig extends AnswerConfig {
  throttle_delay?: number; // Throttle delay in milliseconds for chat messages updates during streaming. Disabled by default.
}
```

### ChatInitialState

The `initialState` prop accepts a partial `ChatInitialState` object with the following properties:

| Property                  | Type                           | Description                                                          |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| `userPrompt`              | `string`                       | Initial user prompt text                                             |
| `interactions`            | `(Interaction \| undefined)[]` | Array of previous chat interactions to pre-populate the chat history |
| `answerSession`           | `AnswerSession \| null`        | Current answer session object from Orama                             |
| `scrollToLastInteraction` | `boolean`                      | Whether to automatically scroll to the last interaction              |
| `isStreaming`             | `boolean`                      | Whether the chat is currently streaming a response                   |

> **Note**: The `AnswerConfig` type is imported from `@orama/core`. For the complete list of available options and their descriptions, please refer to the [Orama documentation](https://docs.orama.com/).

## Usage

### Basic Usage

```tsx
import { ChatRoot } from "@orama/ui/components";
import { OramaCloud } from "@orama/core";

const orama = new OramaCloud({
  projectId: "your-project-id",
  apiKey: "your-api-key",
});

function App() {
  return (
    <ChatRoot client={orama}>
      <ChatComponent />
    </ChatRoot>
  );
}
```

### With configuration and callbacks

```tsx
<ChatRoot
  client={orama}
  askOptions={{
    throttle_delay: 100,
    related: { enabled: true, size: 3 },
  }}
  onAskStart={(options) => console.log("Starting:", options)}
  onAskComplete={() => console.log("Completed")}
  onAskError={(error) => console.error("Error:", error)}
>
  <ChatComponent />
</ChatRoot>
```

### With pre-populated state

```tsx
<ChatRoot
  client={orama}
  initialState={{
    interactions: [
      {
        query: "Welcome message",
        response: { text: "Hi there! I'm here to help you." },
        interactionId: "welcome-1",
      },
    ],
    userPrompt: "Type your question here...",
  }}
>
  <ChatComponent />
</ChatRoot>
```

## Configuration Options

### Ask Options (`askOptions`)

The `askOptions` prop allows you to configure default behavior for all ask operations:

```tsx
<ChatRoot
  client={orama}
  askOptions={{
    // Throttle UI updates during streaming (milliseconds)
    throttle_delay: 100,

    // Enable related questions
    related: {
      enabled: true,
      size: 3,
      format: 'question'
    },

    // Other Orama AnswerConfig options...
  }}
>
```

### Callbacks

Configure global callback handlers for ask operations:

```tsx
<ChatRoot
  client={orama}
  onAskStart={(options) => {
    console.log('Ask started with options:', options)
    // Track analytics, show loading states, etc.
  }}
  onAskComplete={() => {
    console.log('Ask completed successfully')
    // Hide loading states, track success, etc.
  }}
  onAskError={(error) => {
    console.error('Ask failed:', error)
    // Show error notifications, track failures, etc.
  }}
>
```
