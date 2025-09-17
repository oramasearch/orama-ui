import React, { useReducer } from 'react'
import {
  ChatContext,
  ChatDispatchContext,
  ChatInitialState,
  chatReducer,
  ExtendedAnswerConfig,
  useChatContext,
  type ChatContextProps
} from '../contexts/ChatContext'

/**
 * ChatRoot component provides context for managing chat state and actions.
 *
 * This component serves as the foundation for chat functionality, managing state through
 * a reducer pattern and providing both state and dispatch contexts to child components.
 * It supports lifecycle callbacks, default ask options, and can be nested for complex
 * chat scenarios.
 *
 * @example
 * // Basic usage
 * <ChatRoot client={orama}>
 *   <ChatComponent />
 * </ChatRoot>
 *
 * @example
 * // With configuration options and lifecycle callbacks
 * <ChatRoot
 *   client={orama}
 *   askOptions={{
 *     throttle_delay: 100,
 *     related: { enabled: true, size: 3 }
 *   }}
 *   onAskStart={(options) => console.log('Starting:', options)}
 *   onAskComplete={() => console.log('Completed')}
 *   onAskError={(error) => console.error('Error:', error)}
 * >
 *   <ChatComponent />
 * </ChatRoot>
 *
 * @example
 * // With pre-populated chat state
 * <ChatRoot
 *   client={orama}
 *   initialState={{
 *     interactions: [
 *       {
 *         query: "Welcome message",
 *         response: { text: "Hi there! I'm here to help you." },
 *         interactionId: "welcome-1"
 *       }
 *     ]
 *   }}
 * >
 *   <ChatComponent />
 * </ChatRoot>
 */
export interface ChatRootProps extends React.PropsWithChildren {
  /**
   * Required Orama client to be used for chat operations.
   * This client is essential for executing chat queries and managing interactions.
   */
  client: ChatContextProps['client']
  /**
   * Default options for ask operations, including throttling.
   */
  askOptions?: Partial<ExtendedAnswerConfig>
  /**
   * Callback fired when an ask operation starts.
   */
  onAskStart?: (options: ExtendedAnswerConfig) => void

  /**
   * Callback fired when an ask operation completes successfully.
   */
  onAskComplete?: () => void

  /**
   * Callback fired when an ask operation encounters an error.
   */
  onAskError?: (error: Error) => void

  /**
   * Initial state data for the chat context.
   * This includes state data like interactions, prompts, etc.
   */
  initialState?: Partial<Omit<ChatInitialState, 'client'>>
}

export const ChatRoot = ({
  client,
  askOptions,
  onAskStart,
  onAskComplete,
  onAskError,
  initialState = {},
  children
}: ChatRootProps) => {
  const chatState = useChatContext()

  if (typeof window !== 'undefined' && !client && !chatState.client) {
    console.warn(
      'ChatRoot: No client provided. Either pass a client in initialState or ensure a parent ChatRoot has a client.'
    )
  }

  const [state, dispatch] = useReducer(chatReducer, {
    ...chatState,
    client: client || chatState.client,
    ...initialState,
    askOptions: {
      ...chatState.askOptions,
      ...askOptions
    },
    onAskStart: onAskStart || chatState.onAskStart,
    onAskComplete: onAskComplete || chatState.onAskComplete,
    onAskError: onAskError || chatState.onAskError
  })

  return (
    <ChatContext.Provider value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext.Provider>
  )
}
