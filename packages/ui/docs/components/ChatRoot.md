# `ChatRoot` component

The `ChatRoot` component provides the context and state management for Orama chat operations in your React application. It uses a reducer to manage chat-related state and provides both the state and dispatch function to its descendants via context.

This component is typically used to wrap parts of your UI that require access to chat functionality, such as sending messages, receiving responses, and interacting with the Orama client.

## Props

| Name          | Type                                         | Description                                                                                     |
| ------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| client        | `OramaCloud`                                 | The Orama client instance to be used for chat operations.                                       |
| children      | `React.ReactNode`                            | The child components that will have access to the chat context.                                 |
| onAskStart    | `(options: AnswerConfig) => void` (optional) | Callback function triggered when a chat request starts. Receives the answer configuration.      |
| onAskComplete | `() => void` (optional)                      | Callback function triggered when a chat request completes successfully.                         |
| onAskError    | `(error: Error) => void` (optional)          | Callback function triggered when a chat request encounters an error. Receives the error object. |
| askOptions    | `Omit<AnswerConfig, "query">` (optional)     | Options to pass to all ask requests within this ChatRoot context.                               |

> **Note**: The `AnswerConfig` type is imported from `@orama/core`. For the complete list of available options and their descriptions, please refer to the [OramaCore client documentation](hhttps://github.com/oramasearch/oramacore).

## Usage

```tsx
import { ChatRoot } from "@orama/ui/components";
import { OramaCloud } from "@orama/core";

const orama = new OramaCloud({
  /* ...config... */
});
```

### Basic Usage

```tsx
<ChatRoot client={orama}>{/* Chat-related components go here */}</ChatRoot>
```

### With Event Handlers

```tsx
<ChatRoot
  client={orama}
  onAskStart={(options) => {
    console.log("Chat request started with options:", options);
  }}
  onAskComplete={() => {
    console.log("Chat request completed successfully");
  }}
  onAskError={(error) => {
    console.error("Chat request failed:", error);
  }}
>
  {/* Chat-related components go here */}
</ChatRoot>
```

### With askOptions

The `askOptions` prop allows you to set default configuration for all chat requests within the ChatRoot context. These options will be automatically passed to every `ask` call made by components within this context.

```tsx
<ChatRoot
  client={orama}
  askOptions={{
    related: {
      enabled: true,
      size: 3,
      format: "question",
    },
  }}
>
  {/* All ask requests will include the above options */}
</ChatRoot>
```

### Complete Example

```tsx
<ChatRoot
  client={orama}
  askOptions={{
    related: {
      enabled: true,
      size: 5,
      format: 'question'
    },
    datasourceIDs={['123', '456']}
  }}
  onAskStart={(options) => {
    console.log("Starting chat with:", options);
    // Analytics tracking example
    analytics.track('chat_started', { query: options.query });
  }}
  onAskComplete={() => {
    console.log("Chat completed");
    analytics.track('chat_completed');
  }}
  onAskError={(error) => {
    console.error("Chat error:", error);
    analytics.track('chat_error', { error: error.message });
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

## How askOptions Work

1. **Global Defaults**: `askOptions` set at the ChatRoot level become the default for all ask operations within that context.

2. **Context Inheritance**: All child components automatically inherit the `askOptions` through the chat context.
