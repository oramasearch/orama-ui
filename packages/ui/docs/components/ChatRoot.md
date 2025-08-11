# `ChatRoot` component

The `ChatRoot` component provides the context and state management for Orama chat operations in your React application. It uses a reducer to manage chat-related state and provides both the state and dispatch function to its descendants via context.

This component is typically used to wrap parts of your UI that require access to chat functionality, such as sending messages, receiving responses, and interacting with the Orama client.

## Props

| Name         | Type                                   | Description                                                                                                                    |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| client       | `OramaCloud`                           | **Required.** The Orama client instance to be used for chat operations.                                                        |
| children     | `React.ReactNode`                      | The child components that will have access to the chat context.                                                                |
| initialState | `Partial<ChatContextProps>` (optional) | Initial state for the chat context. Allows you to configure callbacks, options, and pre-populate the chat with initial values. |

### initialState Properties

The `initialState` prop accepts a partial `ChatContextProps` object with the following optional properties:

| Property                | Type                              | Description                                                                                     |
| ----------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- | --- |
| onAskStart              | `(options: AnswerConfig) => void` | Callback function triggered when a chat request starts. Receives the answer configuration.      |
| onAskComplete           | `() => void`                      | Callback function triggered when a chat request completes successfully.                         |
| onAskError              | `(error: Error) => void`          | Callback function triggered when a chat request encounters an error. Receives the error object. |
| askOptions              | `Omit<AnswerConfig, "query">`     | Default options to pass to all ask requests within this ChatRoot context.                       |     |
| userPrompt              | `string`                          | Current user prompt text.                                                                       |
| interactions            | `(Interaction \| undefined)[]`    | Array of previous chat interactions to pre-populate the chat history.                           |
| answerSession           | `AnswerSession \| null`           | Current answer session object from Orama.                                                       |
| scrollToLastInteraction | `boolean`                         | Whether to automatically scroll to the last interaction.                                        |
| isStreaming             | `boolean`                         | Whether the chat is currently streaming a response.                                             |

> **Note**: The `AnswerConfig` type is imported from `@orama/core`. For the complete list of available options and their descriptions, please refer to the [OramaCore client documentation](hhttps://github.com/oramasearch/oramacore).

## Usage

```tsx
import { ChatRoot } from "@orama/ui/components";
import { OramaCloud } from "@orama/core";

const orama = new OramaCloud({
  projectId: "your-project-id",
  apiKey: "your-api-key",
});
```

### Basic Usage

```tsx
<ChatRoot client={orama}>{/* Chat-related components go here */}</ChatRoot>
```

### With Initial State and Event Handlers

```tsx
<ChatRoot
  client={orama}
  initialState={{
    onAskStart: (options) => {
      console.log("Chat request started with options:", options);
    },
    onAskComplete: () => {
      console.log("Chat request completed successfully");
    },
    onAskError: (error) => {
      console.error("Chat request failed:", error);
    },
  }}
>
  {/* Chat-related components go here */}
</ChatRoot>
```

### With askOptions

The `askOptions` property in `initialState` allows you to set default configuration for all chat requests within the ChatRoot context. These options will be automatically passed to every `ask` call made by components within this context.

```tsx
<ChatRoot
  client={orama}
  initialState={{
    askOptions: {
      related: {
        enabled: true,
        size: 3,
        format: "question",
      },
    },
  }}
>
  {/* All ask requests will include the above options */}
</ChatRoot>
```

### Pre-populating Chat State

You can use `initialState` to pre-populate the chat with existing interactions, user prompts, or other state:

```tsx
<ChatRoot
  client={orama}
  initialState={{
    interactions: [
      {
        query: "Hello",
        response: { text: "Hi there! I'm here to help you." },
      },
    ],
    scrollToLastInteraction: true,
  }}
>
  {/* Chat starts with pre-populated content */}
</ChatRoot>
```

### Complete Example

```tsx
<ChatRoot
  client={orama}
  initialState={{
    askOptions: {
      related: {
        enabled: true,
        size: 5,
        format: "question",
      },
      datasourceIDs: ["123", "456"],
    },
    onAskStart: (options) => {
      console.log("Starting chat with:", options);
      // Analytics tracking example
      analytics.track("chat_started", { query: options.query });
    },
    onAskComplete: () => {
      console.log("Chat completed");
      analytics.track("chat_completed");
    },
    onAskError: (error) => {
      console.error("Chat error:", error);
      analytics.track("chat_error", { error: error.message });
    },
    scrollToLastInteraction: true,
  }}
>
  {/* Chat components inherit askOptions */}
  <ChatInteractions.Wrapper>
    {(interaction) => (
      <>
        <ChatInteractions.UserPrompt>
          {interaction.query}
        </ChatInteractions.UserPrompt>
        <ChatInteractions.AssistantMessage>
          {interaction.response}
        </ChatInteractions.AssistantMessage>
      </>
    )}
  </ChatInteractions.Wrapper>

  <PromptTextArea.Wrapper>
    <PromptTextArea.Field placeholder="Ask something..." />
    <PromptTextArea.Button>Send</PromptTextArea.Button>
  </PromptTextArea.Wrapper>
</ChatRoot>
```

## How initialState Works

1. **Flexible Configuration**: The `initialState` prop allows you to configure any aspect of the chat context in a single object.

2. **Default Options**: Properties like `askOptions` set in `initialState` become defaults for all chat operations within that context.

3. **Context Inheritance**: All child components automatically inherit the configuration through the chat context.

4. **Pre-population**: You can pre-populate the chat with existing interactions, prompts, or other state data.

5. **Partial Updates**: Since `initialState` accepts a partial object, you only need to specify the properties you want to configure.
