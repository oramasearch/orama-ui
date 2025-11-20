import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useChatContext, useChatDispatch } from '../contexts'
import { AnswerConfig, AnswerSession, Interaction } from '@orama/core'
import throttle from 'throttleit'
import { ExtendedAnswerConfig } from '@/contexts/ChatContext'

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
 * @param {Partial<ExtendedAnswerConfig>} [defaultOptions] - Default options for all ask operations.
 *   These will be merged with context options and used for every ask call unless overridden.
 *   Includes throttle_delay and all standard AnswerConfig options.
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
 * } = useChat({}, {
 *   onAskStart: (options) => { // custom logic },
 *   onAskComplete: () => { // custom logic },
 *   onAskError: (error) => { // custom error handling }
 * });
 */
export interface ChatCallbacks {
  onAskStart?: (options: ExtendedAnswerConfig) => void
  onAskComplete?: () => void
  onAskError?: (error: Error) => void
}

export interface useChatProps {
  ask: (options: ExtendedAnswerConfig) => Promise<void>
  abort: () => void
  regenerateLatest: () => void
  reset: () => void
  context: ReturnType<typeof useChatContext>
  dispatch: ReturnType<typeof useChatDispatch>
  loading: boolean
  error: Error | null
}

export function useChat(
  options: Partial<ExtendedAnswerConfig> = {},
  callbacks: ChatCallbacks = {}
): useChatProps {
  const context = useChatContext()
  const dispatch = useChatDispatch()
  const {
    client,
    interactions,
    answerSession,
    askOptions: contextAskOptions
  } = context
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const throttledDispatchRef = useRef<((state: Interaction[]) => void) | null>(
    null
  )
  const rafIdRef = useRef<number | null>(null)

  const mergedDefaultOptions = useMemo(() => {
    return {
      throttle_delay: 0,
      ...contextAskOptions,
      ...options
    }
  }, [contextAskOptions, options])

  const createThrottledDispatch = useCallback(
    (throttle_delay: number) => {
      const updateInteractions = (state: Interaction[]) => {
        const normalizedState = state.filter((item) => !!item.query)
        if (normalizedState.length > 0) {
          const updatedInteractions = [
            ...(interactions ?? []),
            ...normalizedState
          ]
          const rafId = requestAnimationFrame(() => {
            dispatch({
              type: 'SET_INTERACTIONS',
              payload: { interactions: updatedInteractions }
            })
          })
          rafIdRef.current = rafId
        }
      }

      return throttle_delay > 0
        ? throttle(updateInteractions, throttle_delay)
        : updateInteractions
    },
    [interactions, dispatch]
  )

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of answerStream) {
          //   console.log("Received answer chunk", _);
        }
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    },
    [dispatch]
  )

  const ask = useCallback(
    async (options: ExtendedAnswerConfig) => {
      setLoading(true)
      setError(null)

      const mergedAskOptions: ExtendedAnswerConfig = {
        ...mergedDefaultOptions,
        ...options
      }

      const { throttle_delay = 0, ...restOptions } = mergedAskOptions

      const throttledDispatch = createThrottledDispatch(throttle_delay)
      throttledDispatchRef.current = throttledDispatch

      const onAskStart = callbacks.onAskStart || context.onAskStart
      const onAskComplete = callbacks.onAskComplete || context.onAskComplete
      const onAskError = callbacks.onAskError || context.onAskError

      if (onAskStart) {
        onAskStart(mergedAskOptions)
      }

      const { query: userPrompt } = options || {}

      if (!userPrompt) {
        const err = new Error('User prompt cannot be empty')
        setError(err)
        setLoading(false)
        onAskError?.(err)
        return
      }
      if (!client) {
        const err = new Error('Client is not initialized')
        setError(err)
        setLoading(false)
        onAskError?.(err)
        return
      }

      try {
        let session = answerSession
        if (!session) {
          session = client.ai.createAISession({
            events: {
              onStateChange: (state) => {
                throttledDispatch(state)
              }
            }
          })
          dispatch({
            type: 'SET_ANSWER_SESSION',
            payload: { answerSession: session }
          })
        }
        await streamAnswer(session, restOptions)
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
        onAskComplete?.()
        setLoading(false)
      } catch (err) {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
        setError(err as Error)
        setLoading(false)
        onAskError?.(err as Error)
      }
    },
    [
      client,
      answerSession,
      createThrottledDispatch,
      dispatch,
      context,
      streamAnswer,
      callbacks,
      mergedDefaultOptions
    ]
  )

  const abort = useCallback(() => {
    if (!answerSession) throw new Error('Answer session is not initialized')
    try {
      console.log('Aborting answer session')
      answerSession.abort()
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      setLoading(false)
      setError(null)
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

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    throttledDispatchRef.current = null

    answerSession.clearSession()
    dispatch({ type: 'CLEAR_INTERACTIONS' })
    dispatch({ type: 'CLEAR_USER_PROMPT' })
    dispatch({ type: 'CLEAR_INITIAL_USER_PROMPT' })
  }, [answerSession, interactions, abort, dispatch])

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      throttledDispatchRef.current = null
    }
  }, [])

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
