import React, { useReducer } from "react";
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  useChatContext,
} from "../context/ChatContext";
import { CollectionManager } from "@orama/core";

/* ChatRoot component provides a context for managing chat state and actions.
 * It uses a reducer to manage the state and provides the context to its children.
 * The `client` prop allows passing a custom CollectionManager instance.
 * 
 * Usage:
 * <ChatRoot client={myCollectionManager}>
 *   <ChatComponent />
 * </ChatRoot>
 */
export interface ChatRootProps extends React.PropsWithChildren {
  client: CollectionManager;
}

const ChatRoot = ({ client, children }: ChatRootProps) => {
  const chatState = useChatContext();
  const [state, dispatch] = useReducer(chatReducer, {
    ...chatState,
    client: client || chatState.client,
  });

  return (
    <ChatContext value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext>
  );
};

export default ChatRoot;
