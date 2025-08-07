import { useState, useCallback } from 'react'
import { useChatContext, useChatDispatch } from '../contexts'
import { AnswerConfig, AnswerSession } from '@orama/core'

/**
 * Custom React hook for managing chat interactions.
 *
 * Features:
 * - Send prompts and handle streaming answers.
 * - Abort the current answer stream.
 * - Regenerate the latest answer.
 * - Reset the chat session and clear interactions.
 * - Provides loading and error state.
 * - Supports lifecycle callbacks for ask events.
 *
 * @param {UseChatCallbacks} [callbacks] - Optional callbacks for ask lifecycle:
 *   - `onAskStart(options)`: Called when ask starts, receives the prompt options.
 *   - `onAskComplete()`: Called when ask completes successfully.
 *   - `onAskError(error)`: Called when ask fails, receives the error.
 *
 * @returns {useChatProps} An object containing:
 *   - `ask`: Function to send a user prompt and handle the answer stream.
 *   - `abort`: Function to abort the current answer stream.
 *   - `regenerateLatest`: Function to regenerate the latest answer.
 *   - `reset`: Function to reset the chat session and clear interactions.
 *   - `context`: The chat context containing client and session information.
 *   - `dispatch`: Function to dispatch actions to the chat state.
 *   - `loading`: Boolean indicating if a request is in progress.
 *   - `error`: Error object if an error occurred, otherwise `null`.
 *
 * @throws Will throw errors if required dependencies (like answer session or client) are not initialized.
 *
 * @example
 * const {
 *   ask,
 *   abort,
 *   regenerateLatest,
 *   reset,
 *   loading,
 *   error,
 * } = useChat({
 *   onAskStart: (options) => { // custom logic },
 *   onAskComplete: () => { // custom logic },
 *   onAskError: (error) => { // custom error handling }
 * });
 */
export interface UseChatCallbacks {
  onAskStart?: (options: AnswerConfig) => void
  onAskComplete?: () => void
  onAskError?: (error: Error) => void
}

export interface useChatProps {
  ask: (options: AnswerConfig) => Promise<void>
  abort: () => void
  regenerateLatest: () => void
  reset: () => void
  context: ReturnType<typeof useChatContext>
  dispatch: ReturnType<typeof useChatDispatch>
  loading: boolean
  error: Error | null
}

export function useChat(callbacks: UseChatCallbacks = {}): useChatProps {
  const context = useChatContext()
  const dispatch = useChatDispatch()
  const { client, interactions, answerSession } = context
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const streamAnswer = useCallback(
    async (session: AnswerSession | null, options: AnswerConfig) => {
      if (!session) throw new Error('Answer session is not initialized')
      const { query: userPrompt, ...restOptions } = options || {}
      if (!userPrompt) throw new Error('User prompt cannot be empty')

      try {
        const answerStream = session.answerStream({
          query: userPrompt,
          ...restOptions
        })
        dispatch({ type: 'CLEAR_USER_PROMPT' })

        if (!answerStream) throw new Error('Answer stream is not initialized')
        for await (const _ of answerStream) {
          // console.log("Received answer chunk", _);
        }
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    },
    [dispatch]
  )

  const ask = useCallback(
    async (options: AnswerConfig) => {
      setLoading(true)
      setError(null)

      if (callbacks.onAskStart) {
        callbacks.onAskStart(options)
      } else if (context.onAskStart) {
        context.onAskStart(options)
      }

      const { query: userPrompt } = options || {}

      if (!userPrompt) {
        const err = new Error('User prompt cannot be empty')
        setError(err)
        setLoading(false)
        if (callbacks.onAskError) {
          callbacks.onAskError(err)
        } else if (context.onAskError) {
          context.onAskError(err)
        }
        return
      }
      if (!client) {
        const err = new Error('Client is not initialized')
        setError(err)
        setLoading(false)
        if (callbacks.onAskError) {
          callbacks.onAskError(err)
        } else if (context.onAskError) {
          context.onAskError(err)
        }
        return
      }
      if (!client) {
        const err = new Error('Client is not initialized')
        setError(err)
        setLoading(false)
        if (callbacks.onAskError) {
          callbacks.onAskError(err)
        } else if (context.onAskError) {
          context.onAskError(err)
        }
        return
      }

      try {
        let session = answerSession
        if (!session) {
          session = client.ai.createAISession({
            events: {
              onStateChange: (state) => {
                const normalizedState = state.filter((item) => !!item.query)
                if (normalizedState.length > 0) {
                  const updatedInteractions = [
                    ...(interactions ?? []),
                    ...normalizedState
                  ]
                  dispatch({
                    type: 'SET_INTERACTIONS',
                    payload: { interactions: updatedInteractions }
                  })
                }
              }
            }
          })
          dispatch({
            type: 'SET_ANSWER_SESSION',
            payload: { answerSession: session }
          })
        }
        await streamAnswer(session, options)
        if (callbacks.onAskComplete) {
          callbacks.onAskComplete()
        } else if (context.onAskComplete) {
          context.onAskComplete()
        }
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
        if (callbacks.onAskError) {
          callbacks.onAskError(err as Error)
        } else if (context.onAskError) {
          context.onAskError(err as Error)
        }
      }
    },
    [
      client,
      answerSession,
      interactions,
      dispatch,
      context,
      streamAnswer,
      callbacks
    ]
  )

  const abort = useCallback(() => {
    if (!answerSession) throw new Error('Answer session is not initialized')
    try {
      console.log('Aborting answer session')
      answerSession.abort()
    } catch (error) {
      console.error('Error aborting answer:', error)
    }
  }, [answerSession])

  const regenerateLatest = useCallback(() => {
    if (!answerSession) throw new Error('Answer session is not initialized')
    answerSession.regenerateLast({ stream: false })
  }, [answerSession])

  const reset = useCallback(() => {
    if (!answerSession) throw new Error('Answer session is not initialized')
    if (!interactions || interactions.length < 1) return

    const lastInteraction = interactions[interactions.length - 1]
    if (lastInteraction?.loading) abort()

    answerSession.clearSession()
    dispatch({ type: 'CLEAR_INTERACTIONS' })
    dispatch({ type: 'CLEAR_USER_PROMPT' })
    dispatch({ type: 'CLEAR_INITIAL_USER_PROMPT' })
  }, [answerSession, interactions, abort, dispatch])

  return {
    ask,
    abort,
    regenerateLatest,
    reset,
    loading,
    context,
    dispatch,
    error
  }
}
