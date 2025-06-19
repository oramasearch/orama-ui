import { useState, useCallback } from "react";
import { useChatContext, useChatDispatch } from "../context/ChatContext";
import { AnswerSession } from "@orama/core";

/**
 * Custom React hook for managing chat interactions, including sending prompts,
 * handling streaming answers, aborting and regenerating responses, copying messages
 * to clipboard, and resetting the chat session.
 *
 * @returns {object} An object containing:
 * - `onAsk`: Function to send a user prompt and handle the answer stream.
 * - `abortAnswer`: Function to abort the current answer stream.
 * - `regenerateLatest`: Function to regenerate the latest answer.
 * - `copyToClipboard`: Function to copy a message to the clipboard.
 * - `copiedMessage`: The last message successfully copied to the clipboard.
 * - `reset`: Function to reset the chat session and clear interactions.
 * - `loading`: Boolean indicating if a request is in progress.
 * - `error`: Error object if an error occurred, otherwise `null`.
 *
 * @throws Will throw errors if required dependencies (like answer session or client) are not initialized.
 *
 * @example
 * const {
 *   onAsk,
 *   abortAnswer,
 *   regenerateLatest,
 *   copyToClipboard,
 *   copiedMessage,
 *   reset,
 *   loading,
 *   error,
 * } = useChat();
 */
export interface useChatProps {
  onAsk: (args: { userPrompt: string }) => Promise<void>;
  abortAnswer: () => void;
  regenerateLatest: () => void;
  copyToClipboard: (message: string) => void;
  copiedMessage: string;
  reset: () => void;
  loading: boolean;
  error: Error | null;
};

function useChat(): useChatProps {
  const { client, interactions, answerSession } = useChatContext();
  const dispatch = useChatDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState("");

  const streamAnswer = useCallback(
    async (session: AnswerSession | null, userPrompt: string) => {
      if (!session) throw new Error("Answer session is not initialized");
      if (!userPrompt) throw new Error("User prompt cannot be empty");

      try {
        const answerStream = session.answerStream({ query: userPrompt });
        dispatch({ type: "CLEAR_USER_PROMPT" });

        if (!answerStream) throw new Error("Answer stream is not initialized");
        for await (const _ of answerStream) {
          // Handle streamed answer chunk if needed
        }
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    },
    [dispatch]
  );

  const onAsk = useCallback(
    async ({ userPrompt }: { userPrompt: string }) => {
      setLoading(true);
      setError(null);

      if (!userPrompt) {
        setError(new Error("User prompt cannot be empty"));
        setLoading(false);
        return;
      }
      if (!client) {
        setError(new Error("Client is not initialized"));
        setLoading(false);
        return;
      }

      try {
        let session = answerSession;
        if (!session) {
          session = client.createAnswerSession({
            events: {
              onStateChange: (state) => {
                const normalizedState = state.filter((item) => !!item.query);
                if (normalizedState.length > 0) {
                  const updatedInteractions = [
                    ...(interactions ?? []),
                    ...normalizedState,
                  ];
                  dispatch({
                    type: "SET_INTERACTIONS",
                    payload: { interactions: updatedInteractions },
                  });
                }
              },
            },
          });
          dispatch({
            type: "SET_ANSWER_SESSION",
            payload: { answerSession: session },
          });
        }
        await streamAnswer(session, userPrompt);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    },
    [client, answerSession, interactions, dispatch, streamAnswer]
  );

  const abortAnswer = useCallback(() => {
    if (!answerSession) throw new Error("Answer session is not initialized");
    try {
      answerSession.abort();
      // Optionally: setLoading(false);
    } catch (error) {
      console.error("Error aborting answer:", error);
    }
  }, [answerSession]);

  const regenerateLatest = useCallback(() => {
    if (!answerSession) throw new Error("Answer session is not initialized");
    answerSession.regenerateLast({ stream: false });
  }, [answerSession]);

  const reset = useCallback(() => {
    if (!answerSession) throw new Error("Answer session is not initialized");
    if (!interactions || interactions.length < 1) return;

    const lastInteraction = interactions[interactions.length - 1];
    if (lastInteraction?.loading) abortAnswer();

    answerSession.clearSession();
    dispatch({ type: "CLEAR_INTERACTIONS" });
    dispatch({ type: "CLEAR_USER_PROMPT" });
    dispatch({ type: "CLEAR_INITIAL_USER_PROMPT" });
  }, [answerSession, interactions, abortAnswer, dispatch]);

  const copyToClipboard = useCallback((message: string) => {
    setError(null);
    setCopied("");
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      return;
    }
    navigator.clipboard
      .writeText(message)
      .then(() => setCopied(message))
      .catch((err) => {
        console.error("Failed to copy message to clipboard", err);
        setError(new Error("Failed to copy message to clipboard"));
      });
  }, []);

  return {
    onAsk,
    abortAnswer,
    regenerateLatest,
    copyToClipboard,
    copiedMessage: copied,
    reset,
    loading,
    error,
  };
}

export default useChat;