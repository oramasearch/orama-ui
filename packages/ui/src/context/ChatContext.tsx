import { AnswerSession, CollectionManager, Interaction } from "@orama/core";
import { createContext, useContext } from "react";

export type ChatContextProps = {
  client: CollectionManager | null;
  initialUserPrompt?: string;
  userPrompt?: string;
  interactions?: (Interaction | undefined)[];
  lastInteractionVisible?: boolean;
  scrollToLastInteraction?: boolean;
  answerSession: AnswerSession | null;
};

export const initialChatState: ChatContextProps = {
  client: null,
  initialUserPrompt: "",
  interactions: [],
  userPrompt: "",
  lastInteractionVisible: false,
  scrollToLastInteraction: false,
  answerSession: null,
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
    throw new Error(
      "useChatDispatch must be used within a ChatDispatchContext Provider",
    );
  }
  return dispatch;
};

export const chatReducer = (
  state: ChatContextProps,
  action: { type: string; payload?: Partial<ChatContextProps> },
) => {
  switch (action.type) {
    case "SET_CLIENT":
      return { ...state, client: action.payload?.client || null };
    case "SET_INITIAL_USER_PROMPT":
      return {
        ...state,
        initialUserPrompt: action.payload?.initialUserPrompt || "",
      };
    case "SET_ANSWER_SESSION":
      return { ...state, answerSession: action.payload?.answerSession || null };
    case "ADD_INTERACTION":
      return {
        ...state,
        interactions: [
          ...(state.interactions || []),
          action.payload?.interactions?.[0],
        ],
      };
    case "SET_INTERACTIONS":
      return {
        ...state,
        interactions: action.payload?.interactions || [],
      };
    case "CLEAR_INTERACTIONS":
      return {
        ...state,
        interactions: [],
      };
    case "SET_USER_PROMPT":
      return {
        ...state,
        userPrompt: action.payload?.userPrompt || "",
      };
    case "CLEAR_USER_PROMPT":
      return {
        ...state,
        userPrompt: "",
      };
    case "CLEAR_INITIAL_USER_PROMPT":
      return {
        ...state,
        initialUserPrompt: "",
      };
    case "SET_LAST_INTERACTION_VISIBLE":
      return {
        ...state,
        lastInteractionVisible: action.payload?.lastInteractionVisible,
      };
    case "SET_SCROLL_TO_LAST_INTERACTION":
      return {
        ...state,
        scrollToLastInteraction:
          action.payload?.scrollToLastInteraction || false,
      };
    default:
      return state;
  }
};
