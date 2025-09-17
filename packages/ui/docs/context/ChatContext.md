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

## Props & Types

#### `ChatContextProps`

The main context value containing all chat state and configuration:

```tsx
interface ChatContextProps {
  // State properties
  client: OramaCloud | null
  interactions: (Interaction | undefined)[]
  userPrompt: string
  answerSession: AnswerSession | null
  scrollToLastInteraction: boolean
  isStreaming: boolean
  
  // Configuration properties
  askOptions: Partial<ExtendedAnswerConfig>
  onAskStart?: (options: ExtendedAnswerConfig) => void
  onAskComplete?: () => void
  onAskError?: (error: Error) => void
}
```

#### `ChatAction`

Available actions for the chat reducer:

```tsx
type ChatAction =
  | { type: 'SET_CLIENT'; payload: { client: OramaCloud | null } }
  | { type: 'SET_ANSWER_SESSION'; payload: { answerSession: AnswerSession | null } }
  | { type: 'ADD_INTERACTION'; payload: { interactions: (Interaction | undefined)[] } }
  | { type: 'SET_INTERACTIONS'; payload: { interactions: (Interaction | undefined)[] } }
  | { type: 'CLEAR_INTERACTIONS' }
  | { type: 'SET_USER_PROMPT'; payload: { userPrompt: string } }
  | { type: 'CLEAR_USER_PROMPT' }
  | { type: 'CLEAR_INITIAL_USER_PROMPT' }
  | { type: 'SET_SCROLL_TO_LAST_INTERACTION'; payload: { scrollToLastInteraction: boolean } }
```

## Usage

### Accessing context and dispatch

```tsx
import { useChatContext, useChatDispatch } from '@orama/ui/contexts'

function CustomChatComponent() {
  const context = useChatContext()
  const dispatch = useChatDispatch()

  const { 
    client, 
    interactions, 
    loading, 
    askOptions,
    onAskStart,
    onAskComplete,
    onAskError 
  } = context

  // Use context data...

  // Example: Set a new user prompt
  dispatch({
    type: "SET_USER_PROMPT",
    payload: {
      userPrompt: "Give me a quick overview of key metrics for our Q2 review.",
    },
  });
}
```

---

## When to Use

- **Not needed with `ChatRoot`:**  
  If you use the `ChatRoot` component, it manages chat state for you.
- **Custom implementations:**  
  Use this context if you need to build your own chat provider or require advanced state management.


