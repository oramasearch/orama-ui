# useChat

The `useChat` hook provides a comprehensive interface for managing chat interactions in Orama-powered React applications, including sending prompts, handling streaming responses, and managing chat state.

> **Note**: Orama UI chat components (like `PromptTextArea`, `ChatInteractions`, etc.) use this hook internally to manage chat logic. For most use cases, you should use these components instead of calling `useChat` directly. Use this hook when you need custom chat implementations or advanced control over chat behavior that isn't provided by the standard components.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `defaultOptions` | `Partial<ExtendedAnswerConfig>` | No | Default options for all ask operations (includes throttle_delay) |
| `callbacks` | `UseChatCallbacks` | No | Optional callbacks for ask lifecycle events |

#### `ExtendedAnswerConfig`

Extends Orama's `AnswerConfig` with additional UI-specific options:

```tsx
interface ExtendedAnswerConfig extends AnswerConfig {
  throttle_delay?: number // Throttle delay in milliseconds for chat messages updates. Disabled by default
}
```

#### `UseChatCallbacks`

```tsx
interface UseChatCallbacks {
  onAskStart?: (options: ExtendedAnswerConfig) => void
  onAskComplete?: () => void
  onAskError?: (error: Error) => void
}
```

## Return value

| Property | Type | Description |
|----------|------|-------------|
| `ask` | `(options: ExtendedAnswerConfig) => Promise<void>` | Send a user prompt and handle the answer stream |
| `abort` | `() => void` | Abort the current answer stream |
| `regenerateLatest` | `() => void` | Regenerate the latest answer |
| `reset` | `() => void` | Reset the chat session and clear interactions |
| `loading` | `boolean` | Whether a request is in progress |
| `error` | `Error \| null` | Error object if an error occurred |
| `context` | `ChatContextProps` | The chat context containing client and session information |
| `dispatch` | `ChatDispatch` | Function to dispatch actions to the chat state |

## Usage

### Basic Usage

```tsx
import { useChat } from '@orama/ui/hooks'

function ChatComponent() {
  const { ask, loading, error } = useChat()

  const handleSubmit = async () => {
    await ask({
      query: 'What is Orama?',
      throttle_delay: 100
    })
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Asking...' : 'Ask Question'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
```

### With default options and callbacks

```tsx
function ChatComponent() {
  const { ask, loading, regenerateLatest, reset } = useChat(
    // Default options for all ask operations
    {
      throttle_delay: 100,
      related: { enabled: true, size: 3 }
    },
    // Callbacks
    {
      onAskStart: (options) => {
        console.log('Ask started with options:', options)
      },
      onAskComplete: () => {
        console.log('Ask completed successfully')
      },
      onAskError: (error) => {
        console.error('Ask failed:', error)
      }
    }
  )

  const handleAsk = async (query: string) => {
    // Uses default throttle_delay: 100 and related options
    await ask({ query })
  }

  const handleSpecialAsk = async (query: string) => {
    // Override default throttling for this specific request
    await ask({ 
      query,
      throttle_delay: 200,
      related: { enabled: false }
    })
  }

  return (
    <div>
      <button onClick={() => handleAsk('General question')}>
        Ask General Question
      </button>
      <button onClick={() => handleSpecialAsk('Complex question')}>
        Ask Complex Question (slower throttle)
      </button>
      <button onClick={regenerateLatest}>
        Regenerate Latest
      </button>
      <button onClick={reset}>
        Reset Chat
      </button>
    </div>
  )
}
```

### Within `ChatRoot` context

When used within a `ChatRoot`, the hook automatically inherits configuration:

```tsx
// ChatRoot provides base configuration
<ChatRoot
  client={orama}
  askOptions={{ throttle_delay: 50, related: { enabled: true } }}
  onAskError={(error) => console.error('Global error:', error)}
>
  <ChatComponent />
</ChatRoot>

function ChatComponent() {
  // Inherits ChatRoot configuration, can override per operation
  const { ask } = useChat(
    { throttle_delay: 100 }, // Hook defaults override context
    { onAskComplete: () => console.log('Local completion handler') }
  )

  const handleAsk = async () => {
    // Priority: ChatRoot < Hook defaults < Call options
    await ask({ 
      query: 'Question',
      throttle_delay: 200 // Highest priority
    })
  }
}
```

## Configuration priority

Options are merged with the following priority (highest to lowest):

1. **Call-level options**: Options passed directly to `ask()`
2. **Hook-level defaults**: Options passed to `useChat()` first parameter
3. **Context options**: Options from `ChatRoot.askOptions`
4. **Built-in defaults**: Internal fallback values

```tsx
// Example of option merging
<ChatRoot askOptions={{ throttle_delay: 50, related: { enabled: true } }}>
  <Component />
</ChatRoot>

function Component() {
  const { ask } = useChat(
    { throttle_delay: 100, format: 'markdown' }, // Hook defaults
    {}
  )

  await ask({
    query: 'Question',
    throttle_delay: 200, // Overrides all other throttle_delay values
    related: { enabled: false } // Overrides context related.enabled
    // format: 'markdown' inherited from hook defaults
  })
}
```

### Throttling Support

During streaming responses, chat messages are updated in real-time as tokens arrive from the AI. This can cause performance issues when:

- **High-frequency updates**: AI responses stream very quickly, causing excessive re-renders
- **Complex UI**: Chat components have heavy rendering logic (i.e. Markdown) or many child components
- **Mobile devices**: Limited processing power struggles with rapid DOM updates
- **Large conversations**: Many chat interactions make each update more expensive

Throttling reduces update frequency by batching multiple token updates together:

```tsx
const { ask } = useChat()

// No throttling - every token triggers immediate UI update
// Use for simple UIs or when you need real-time character-by-character display
await ask({ query: 'Question', throttle_delay: 0 })

// Moderate throttling - updates every 100ms
// Good balance between responsiveness and performance for most applications
await ask({ query: 'Question', throttle_delay: 100 })

// Heavy throttling - updates every 300ms
// Use for complex UIs, mobile devices, or when performance is critical
await ask({ query: 'Question', throttle_delay: 300 })
```

### Error Handling

```tsx
const { ask, error } = useChat({}, {
  onAskError: (error) => {
    // Handle specific errors
    if (error.message.includes('network')) {
      // Handle network errors
    } else if (error.message.includes('auth')) {
      // Handle authentication errors
    }
  }
})

// Also check error state directly
if (error) {
  console.error('Current error:', error)
}
```