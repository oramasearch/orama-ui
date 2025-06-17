import React, { useReducer } from "react";
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  useChatContext,
} from "../context/ChatContext";
import { CollectionManager } from "@orama/core";

export interface ChatRootProps extends React.PropsWithChildren {
  /**
   * The Orama client instance to be used for search operations.
   * If not provided, it will use the client from the SearchContext.
   */
  client?: CollectionManager;
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
