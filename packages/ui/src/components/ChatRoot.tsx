import React, { useReducer } from 'react'
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  useChatContext
} from '../contexts/ChatContext'
import { AnswerConfig, CollectionManager } from '@orama/core'

/* ChatRoot component provides a contexts for managing chat state and actions.
 * It uses a reducer to manage the state and provides the contexts to its children.
 * The `client` prop allows passing a custom CollectionManager instance.
 *
 * Usage:
 * <ChatRoot client={myCollectionManager}>
 *   <ChatComponent />
 * </ChatRoot>
 */
export interface ChatRootProps extends React.PropsWithChildren {
  client: CollectionManager
  onAskStart?: (options: AnswerConfig) => void
  onAskComplete?: () => void
  onAskError?: (error: Error) => void
}

export const ChatRoot = ({
  client,
  onAskStart,
  onAskComplete,
  onAskError,
  children
}: ChatRootProps) => {
  const chatState = useChatContext()
  const [state, dispatch] = useReducer(chatReducer, {
    ...chatState,
    client: client || chatState.client,
    onAskStart,
    onAskComplete,
    onAskError
  })

  return (
    <ChatContext value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext>
  )
}
