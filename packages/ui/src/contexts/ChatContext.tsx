import { AnswerSession, CollectionManager, Interaction } from "@orama/core";
import { createContext, useContext } from "react";

export type ChatContextProps = {
  client: CollectionManager | null;
  initialUserPrompt?: string;
  userPrompt?: string;
  interactions?: (Interaction | undefined)[];
  answerSession: AnswerSession | null;
  scrollToLastInteraction?: boolean;
  isStreaming?: boolean;
};

export type ChatAction =
  | { type: "SET_CLIENT"; payload: { client: CollectionManager | null } }
  | { type: "SET_INITIAL_USER_PROMPT"; payload: { initialUserPrompt: string } }
  | {
      type: "SET_ANSWER_SESSION";
      payload: { answerSession: AnswerSession | null };
    }
  | {
      type: "ADD_INTERACTION";
      payload: { interactions: (Interaction | undefined)[] };
    }
  | {
      type: "SET_INTERACTIONS";
      payload: { interactions: (Interaction | undefined)[] };
    }
  | { type: "CLEAR_INTERACTIONS" }
  | { type: "SET_USER_PROMPT"; payload: { userPrompt: string } }
  | { type: "CLEAR_USER_PROMPT" }
  | { type: "CLEAR_INITIAL_USER_PROMPT" }
  | {
      type: "SET_SCROLL_TO_LAST_INTERACTION";
      payload: { scrollToLastInteraction: boolean };
    };

export const initialChatState: ChatContextProps = {
  client: null,
  initialUserPrompt: "",
  interactions: [],
  userPrompt: "",
  answerSession: null,
  scrollToLastInteraction: false,
  isStreaming: false,
};

export const ChatContext = createContext<ChatContextProps>(initialChatState);
export const ChatDispatchContext =
  createContext<React.Dispatch<ChatAction> | null>(null);

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

/**
 * Reducer function for managing chat contexts state.
 *
 * Handles various actions to update the chat state, such as setting the client,
 * managing user prompts, answer sessions, and interactions.
 *
 * @param state - The current state of the chat contexts.
 * @param action - An object containing the action type and optional payload to update the state.
 * @returns The updated chat contexts state based on the action type.
 */
export const chatReducer = (state: ChatContextProps, action: ChatAction) => {
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
