import React, { useReducer } from "react";
import {
  ChatContext,
  ChatDispatchContext,
  chatReducer,
  useChatContext,
} from "../contexts/ChatContext";
import { AnswerConfig, CollectionManager } from "@orama/core";

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
 * <ChatRoot client={collectionManager}>
 *   <ChatComponent />
 * </ChatRoot>
 *
 * @example
 * // With callbacks and options
 * <ChatRoot
 *   client={collectionManager}
 *   onAskStart={(options) => console.log('Starting:', options)}
 *   onAskComplete={() => console.log('Completed')}
 *   onAskError={(error) => console.error('Error:', error)}
 *   askOptions={{
 *     related: {
 *       enabled: true,
 *       size: 3,
 *       format: 'question'
 *    },
 *  }}
 * >
 *   <ChatComponent />
 * </ChatRoot>
 */
export interface ChatRootProps extends React.PropsWithChildren {
  /**
   * The CollectionManager instance to manage chat interactions.
   * This is required to perform operations like asking questions and managing answers.
   * If not provided, will fall back to client from parent ChatRoot context.
   */
  client?: CollectionManager;
  /**
   * Optional callbacks for ask lifecycle events.
   * These callbacks will be used as fallbacks when useChat hook doesn't provide its own.
   * Hook-level callbacks take precedence over ChatRoot-level callbacks.
   */
  onAskStart?: (options: AnswerConfig) => void;
  /**
   * Called when an ask operation completes successfully.
   */
  onAskComplete?: () => void;
  /**
   * Called when an ask operation fails.
   * Receives the error object for custom error handling.
   */
  onAskError?: (error: Error) => void;
  /**
   * Default options to be merged with ask requests.
   * These will be used as defaults for all ask operations within this ChatRoot.
   */
  askOptions?: Omit<AnswerConfig, "query">;
}

export const ChatRoot = ({
  client,
  onAskStart,
  onAskComplete,
  onAskError,
  askOptions = {},
  children,
}: ChatRootProps) => {
  const chatState = useChatContext();

  if (typeof window !== "undefined" && !client && !chatState.client) {
    console.warn(
      "ChatRoot: No client provided. Either pass a client prop or ensure a parent ChatRoot has a client.",
    );
  }

  const [state, dispatch] = useReducer(chatReducer, {
    ...chatState,
    client: client || chatState.client,
    onAskStart,
    onAskComplete,
    onAskError,
    askOptions,
  });

  return (
    <ChatContext value={state}>
      <ChatDispatchContext value={dispatch}>{children}</ChatDispatchContext>
    </ChatContext>
  );
};
