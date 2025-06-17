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

  async function streamAnswer(session: AnswerSession | null, userPrompt: string) {
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
      dispatch({
        type: "CLEAR_USER_PROMPT",
      });
      
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

  const onAsk = async ({
    userPrompt
  }: {
    userPrompt: string;
  }) => {
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
              const normalizedState = state.filter((stateItem) => !!stateItem.query)

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
            }
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

  return {
    onAsk,
    loading,
    error,
  };
}

export default useChat;
