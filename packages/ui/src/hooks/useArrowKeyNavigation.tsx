import { useRef, useCallback } from 'react'

interface UseArrowKeysNavigationOptions {
  selectorLeftRight?: string
  selector?: string
  disabled?: boolean
}

export function useArrowKeysNavigation(options: UseArrowKeysNavigationOptions = {}) {
  const { selector = '[data-focus-on-arrow-nav]', selectorLeftRight = '[data-focus-on-arrow-nav-left-right]', disabled = false } = options
  const ref = useRef<HTMLElement>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log('useArrowKeysNavigation', event.key)
      if (disabled || !ref.current) return
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

      event.stopPropagation()
      event.preventDefault()

      const focusableElements = ref.current.querySelectorAll(selector)
      let focusableArray = Array.from(focusableElements) as HTMLElement[]
      focusableArray = focusableArray.filter((element) => element.tabIndex !== -1)

      if (focusableArray.length === 0) return

      console.log('Focusable elements:', focusableArray)

      const firstFocusableElement = focusableArray[0]
      const lastFocusableElement = focusableArray[focusableArray.length - 1]
      const focusedElement = ref.current.querySelector(':focus') as HTMLElement
      const focusedIndex = focusableArray.indexOf(focusedElement)

      let nextFocusableElement: HTMLElement | undefined

      if (event.key === 'ArrowDown') {
        nextFocusableElement =
          focusedIndex === focusableArray.length - 1 ? firstFocusableElement : focusableArray[focusedIndex + 1]
      } else {
        nextFocusableElement = focusedIndex === 0 ? lastFocusableElement : focusableArray[focusedIndex - 1]
      }

      if (nextFocusableElement) {
        nextFocusableElement.focus()
      }
    },
    [selector, disabled]
  )

  const handleArrowLeftRight = useCallback(
    (event: KeyboardEvent) => {
      console.log('useArrowKeysNavigation', event.key)

      if (disabled || !ref.current) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      
      event.stopPropagation()
      event.preventDefault()
      const focusableElements = ref.current.querySelectorAll(selectorLeftRight)
      let focusableArray = Array.from(focusableElements) as HTMLElement[]
      focusableArray = focusableArray.filter((element) => element.tabIndex !== -1)

      if (focusableArray.length === 0) return

      console.log('Focusable elements:', focusableArray)
      const focusedElement = ref.current.querySelector(':focus') as HTMLElement
      const focusedIndex = focusableArray.indexOf(focusedElement)
      let nextFocusableElement: HTMLElement | undefined
      if (event.key === 'ArrowRight') {
        nextFocusableElement =
          focusedIndex === focusableArray.length - 1 ? focusableArray[0] : focusableArray[focusedIndex + 1]
      } else {
        nextFocusableElement = focusedIndex === 0 ? focusableArray[focusableArray.length - 1] : focusableArray[focusedIndex - 1]
      }
      if (nextFocusableElement) {
        nextFocusableElement.focus()
      }
    },
    [selectorLeftRight, disabled]
  )

  return {
    ref,
    onKeyDown: handleKeyDown,
    onArrowLeftRight: handleArrowLeftRight,
  }
}