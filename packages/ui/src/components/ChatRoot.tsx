import React, { useReducer } from 'react'
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  useChatContext
} from '../contexts/ChatContext'
import { CollectionManager } from '@orama/core'

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
}

export const ChatRoot = ({ client, children }: ChatRootProps) => {
  const chatState = useChatContext()
  const [state, dispatch] = useReducer(chatReducer, {
    ...chatState,
    client: client || chatState.client
  })

  return (
    <ChatContext.Provider value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext.Provider>
  )
}
