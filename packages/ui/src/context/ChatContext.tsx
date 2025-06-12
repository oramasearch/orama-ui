import { CollectionManager, Interaction } from "@orama/core";
import { createContext, useContext } from "react";

export type ChatContextProps = {
  client: CollectionManager | null;
  initialUserPrompt?: string;
  interactions?: Interaction[];
}

export const initialChatState: ChatContextProps = {
  client: null,
  initialUserPrompt: "",
  interactions: [],
};

export const ChatContext = createContext<ChatContextProps>(initialChatState);
export const ChatDispatchContext = createContext<React.Dispatch<{
  type: string;
  payload?: Partial<ChatContextProps>;
}> | null>(null);


export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatContext Provider");
  }
  return context;
};

export const useChatDispatch = () => {
  const dispatch = useContext(ChatDispatchContext);
  if (!dispatch) {
    throw new Error("useChatDispatch must be used within a ChatDispatchContext Provider");
  }
  return dispatch;
};

export const chatReducer = (state: ChatContextProps, action: { type: string; payload?: Partial<ChatContextProps> }) => {
  switch (action.type) {
    case "SET_CLIENT":
      return { ...state, client: action.payload?.client || null };
    case "SET_INITIAL_USER_PROMPT":
      return { ...state, initialUserPrompt: action.payload?.initialUserPrompt || "" };
    case "SET_INTERACTIONS":
      return { ...state, interactions: action.payload?.interactions || [] };
    default:
      return state;
  }
};