import { useState } from "react";
import { useChatContext, useChatDispatch } from "../context/ChatContext";
import { AnswerSession } from "@orama/core";

/**
 * A custom hook for managing chat functionality with orama.
 *
 * @example
 * const { onAsk, loading, error } = useChat();
 */

function useChat() {
  const { client, interactions, answerSession } = useChatContext();
  const dispatch = useChatDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState("");

  async function streamAnswer(
    session: AnswerSession | null,
    userPrompt: string,
  ) {
    if (!session) {
      throw new Error("Answer session is not initialized");
    }
    if (!userPrompt) {
      throw new Error("User prompt cannot be empty");
    }
    try {
      const answerStream = session?.answerStream({
        query: userPrompt,
      });
      // dispatch({
      //   type: "CLEAR_USER_PROMPT",
      // });

      const processAsyncGenerator = async () => {
        if (!answerStream) {
          throw new Error("Answer stream is not initialized");
        }
        for await (const answer of answerStream) {
          console.log("Received answer chunk:", answer);
          // Here you can handle the answer chunk, e.g., update state or UI
        }
      };
      await processAsyncGenerator();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return;
    }
  }

  const onAsk = async ({ userPrompt }: { userPrompt: string }) => {
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

    if (!answerSession) {
      try {
        const session = client.createAnswerSession({
          events: {
            onStateChange: (state) => {
              const normalizedState = state.filter(
                (stateItem) => !!stateItem.query,
              );

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
        await streamAnswer(session, userPrompt);
        return;
      } catch (err) {
        setError(err as Error);
        setLoading(false);
        return;
      }
    }

    await streamAnswer(answerSession, userPrompt);
  };

  const abortAnswer = () => {
    if (!answerSession) {
      throw new Error("Answer session is not initialized");
    }

    answerSession.abort();
  };

  const regenerateLatest = async () => {
    if (!answerSession) {
      throw new Error("Answer session is not initialized");
    }

    answerSession.regenerateLast({ stream: false });
  };

  const reset = async () => {
    if (!answerSession) {
      throw new Error("Answer session is not initialized");
    }

    if (interactions && interactions.length < 1) {
      return;
    }

    // TODO: SDK should abort any streaming before cleaning the sessions. It is not doing that today
    const lastInteraction =
      interactions && interactions.length > 0
        ? interactions[interactions.length - 1]
        : undefined;
    if (lastInteraction && lastInteraction.loading) {
      abortAnswer();
    }

    answerSession.clearSession();

    dispatch({ type: "CLEAR_INTERACTIONS" });
    dispatch({ type: "CLEAR_USER_PROMPT" });
    dispatch({ type: "CLEAR_INITIAL_USER_PROMPT" });
  };

  const copyToClipboard = (message: string) => {
    setError(null);
    setCopied("");
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      return;
    }
    navigator.clipboard
      .writeText(message)
      .then(() => {
        console.log("Message copied to clipboard");
        setCopied(message);
      })
      .catch((err) => {
        console.error("Failed to copy message to clipboard", err);
        setError(new Error("Failed to copy message to clipboard"));
      });
  };

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
