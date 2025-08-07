# `ChatContext`

The `ChatContext` provides a React context and reducer for managing chat-related state in applications using Orama Cloud. It is designed to handle chat interactions, user prompts, answer sessions, and related UI state.

> **Note:**  
> The use of this context is **not required** when using the `ChatRoot` component, as `ChatRoot` manages chat state internally.  
> Use this context for custom implementations or advanced use cases where you need direct control over chat state management.

---

## Exports

- **`ChatContext`**: The main React context for chat state.
- **`ChatDispatchContext`**: Context for dispatching chat actions.
- **`useChatContext`**: Hook to access chat state.
- **`useChatDispatch`**: Hook to dispatch chat actions.
- **`chatReducer`**: Reducer function for chat state management.
- **`initialChatState`**: Default chat state.

---

## Props & Types

### `ChatContextProps`

```ts
type ChatContextProps = {
  client: OramaCloud | null;
  initialUserPrompt?: string;
  userPrompt?: string;
  interactions?: (Interaction | undefined)[];
  answerSession: AnswerSession | null;
  scrollToLastInteraction?: boolean;
  isStreaming?: boolean;
};
```

---

## Usage

### With Custom Provider

```tsx
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  initialChatState,
} from "@orama/ui/contexts";

function ChatProvider({ children }) {
  const [state, dispatch] = React.useReducer(chatReducer, initialChatState);

  return (
    <ChatContext value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext>
  );
}
```

### Accessing State and Dispatch

```tsx
import { useChatContext, useChatDispatch } from "@orama/ui/contexts";

function MyComponent() {
  const chatState = useChatContext();
  const dispatch = useChatDispatch();

  // Example: Set a new user prompt
  dispatch({
    type: "SET_USER_PROMPT",
    payload: {
      userPrompt: "Give me a quick overview of key metrics for our Q2 review.",
    },
  });

  return <div>{chatState.userPrompt}</div>;
}
```

---

## Actions

The reducer supports the following action types:

- `SET_CLIENT`
- `SET_INITIAL_USER_PROMPT`
- `SET_ANSWER_SESSION`
- `ADD_INTERACTION`
- `SET_INTERACTIONS`
- `CLEAR_INTERACTIONS`
- `SET_USER_PROMPT`
- `CLEAR_USER_PROMPT`
- `CLEAR_INITIAL_USER_PROMPT`
- `SET_SCROLL_TO_LAST_INTERACTION`

---

## When to Use

- **Not needed with `SearchRoot`:**  
  If you use the `SearchRoot` component, it manages chat state for you.
- **Custom implementations:**  
  Use this context if you need to build your own chat provider or require advanced state management.

---
