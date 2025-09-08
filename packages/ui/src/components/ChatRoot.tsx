import React, { useReducer } from 'react'
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  useChatContext,
  type ChatContextProps
} from '../contexts/ChatContext'
import { CollectionManager } from '@orama/core'

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
 * // With callbacks and options
 * <ChatRoot
 *   client={orama}
 *   initialState={{
 *     onAskStart: (options) => console.log('Starting:', options),
 *     onAskComplete: () => console.log('Completed'),
 *     onAskError: (error) => console.error('Error:', error),
 *     askOptions: {
 *       related: {
 *         enabled: true,
 *         size: 3,
 *         format: 'question'
 *       }
 *     }
 *   }}
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
   * Initial state for the chat context.
   * This allows you to configure the client, callbacks, options, and pre-populate
   * the chat with initial values like interactions, user prompts, or other state properties.
   */
  initialState?: Partial<Omit<ChatContextProps, 'client'>>
}

export const ChatRoot = ({
  client,
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
    ...initialState
  })

  return (
    <ChatContext.Provider value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext.Provider>
  )
}
