import { useRef, useState } from "react";
import {
  type CollectionManager,
  type AnswerSession,
  type SearchParams,
} from "@orama/core";

interface UseChatOptions {
  client?: CollectionManager;
  initialUserPrompt?: string;
  onUserPromptChange?: (val: string) => void;
}

type Interaction = {
  query: string;
  interactionId: string;
  response: string;
};
/**
 * A custom hook for managing search functionality with orama.
 *
 * @example
 * const { onSearch, loading, error } = useSearch({
 *   client: collectionManager,
 *   initialSearchTerm: 'initial term',
 *   onSearchTermChange: (term) => console.log(term),
 * });
 */

function useChat({
  client,
  initialUserPrompt = "",
  onUserPromptChange,
}: UseChatOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [answerSession, setAnswerSession] = useState<AnswerSession | null>(null);
  const currentPromptRef = useRef(initialUserPrompt);

  const onAsk = async (
    options: SearchParams
  ) => {
    currentPromptRef.current = options.term || initialUserPrompt;
    onUserPromptChange?.(options.term || initialUserPrompt);

    setLoading(true);
    setError(null);

    if (!client) {
      setError(new Error("Client is not initialized"));
      setLoading(false);
      return;
    }

    if (!answerSession) {
      try {
        const session = await client.createAnswerSession({
          events: {
            onStateChange: (state) => {
              const normalizedState = state.filter((stateItem) => !!stateItem.query)

              if (normalizedState.length > 0) {
                console.log("Normalized state:", normalizedState);
                const updatedInteractions = [
                  ...interactions,
                  ...normalizedState.map((interaction, index) => {
                    return {
                      query: interaction.query,
                      interactionId: interaction.id,
                      response: interaction.response
                    }
                  }),
                ];
                setInteractions(updatedInteractions as any[]);
              }
            }
          },
        });
        setAnswerSession(session);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
        return;
      }
    }

    try {
      const answerStream = answerSession?.answerStream({
        query: currentPromptRef.current,
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
  };

  return {
    onAsk,
    interactions,
    loading,
    error,
    prompt: currentPromptRef.current,
  };
}

export default useChat;
