import { useRef, useCallback } from 'react'

interface UseArrowKeysNavigationOptions {
  selectorLeftRight?: string
  selector?: string
  disabled?: boolean
}

/**
 * A custom React hook that enables keyboard navigation using arrow keys within a container element.
 *
 * This hook provides a `ref` to attach to a container and two handlers for keyboard events:
 * - `onKeyDown`: Handles vertical navigation (ArrowUp/ArrowDown) among focusable elements.
 * - `onArrowLeftRight`: Handles horizontal navigation (ArrowLeft/ArrowRight) among focusable elements.
 *
 * @param options - Configuration options for the hook.
 * @param options.selector - CSS selector string to identify vertically navigable focusable elements. Defaults to `[data-focus-on-arrow-nav]`.
 * @param options.selectorLeftRight - CSS selector string to identify horizontally navigable focusable elements. Defaults to `[data-focus-on-arrow-nav-left-right]`.
 * @param options.disabled - If true, disables all keyboard navigation. Defaults to `false`.
 *
 * @returns An object containing:
 * - `ref`: React ref to attach to the container element.
 * - `onKeyDown`: Keyboard event handler for ArrowUp/ArrowDown navigation.
 * - `onArrowLeftRight`: Keyboard event handler for ArrowLeft/ArrowRight navigation.
 *
 * @example
 * ```tsx
 * const { ref, onKeyDown, onArrowLeftRight } = useArrowKeysNavigation();
 *
 * return (
 *   <div ref={ref} onKeyDown={onKeyDown}>
 *     <button data-focus-on-arrow-nav>Item 1</button>
 *     <button data-focus-on-arrow-nav>Item 2</button>
 *     <button data-focus-on-arrow-nav>Item 3</button>
 *   </div>
 * );
 * ```
 */
export function useArrowKeysNavigation(
  options: UseArrowKeysNavigationOptions = {}
) {
  const {
    selector = '[data-focus-on-arrow-nav]',
    selectorLeftRight = '[data-focus-on-arrow-nav-left-right]',
    disabled = false
  } = options
  const ref = useRef<HTMLElement>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled || !ref.current) return
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

      event.stopPropagation()
      event.preventDefault()

      const focusableElements = ref.current.querySelectorAll(selector)
      const focusableArray = Array.from(focusableElements).filter((element) => {
        const dataValue = (element as HTMLElement).getAttribute(
          'data-focus-on-arrow-nav'
        )
        const tabIndex = (element as HTMLElement).getAttribute('tabIndex')
        const ariaHidden = (element as HTMLElement).getAttribute('aria-hidden')
        return (
          dataValue !== 'false' && tabIndex !== '-1' && ariaHidden !== 'true'
        )
      }) as HTMLElement[]

      if (focusableArray.length === 0) return

      const firstFocusableElement = focusableArray[0]
      const lastFocusableElement = focusableArray[focusableArray.length - 1]
      const focusedElement = ref.current.querySelector(':focus') as HTMLElement
      const focusedIndex = focusableArray.indexOf(focusedElement)

      let nextFocusableElement: HTMLElement | undefined

      if (event.key === 'ArrowDown') {
        nextFocusableElement =
          focusedIndex === focusableArray.length - 1
            ? firstFocusableElement
            : focusableArray[focusedIndex + 1]
      } else {
        nextFocusableElement =
          focusedIndex === 0
            ? lastFocusableElement
            : focusableArray[focusedIndex - 1]
      }

      if (nextFocusableElement) {
        nextFocusableElement.focus()
      }
    },
    [selector, disabled]
  )

  const handleArrowLeftRight = useCallback(
    (event: KeyboardEvent) => {
      if (disabled || !ref.current) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.stopPropagation()
      event.preventDefault()
      const focusableElements = ref.current.querySelectorAll(selectorLeftRight)

      const focusableArray = Array.from(focusableElements).filter((element) => {
        const dataValue = element.getAttribute('data-focus-on-arrow-nav')
        const tabIndex = element.getAttribute('tabIndex')
        const ariaHidden = element.getAttribute('aria-hidden')
        return (
          dataValue !== 'false' && tabIndex !== '-1' && ariaHidden !== 'true'
        )
      }) as HTMLElement[]

      if (focusableArray.length === 0) return

      const focusedElement = ref.current.querySelector(':focus') as HTMLElement
      const focusedIndex = focusableArray.indexOf(focusedElement)
      let nextFocusableElement: HTMLElement | undefined
      if (event.key === 'ArrowRight') {
        nextFocusableElement =
          focusedIndex === focusableArray.length - 1
            ? focusableArray[0]
            : focusableArray[focusedIndex + 1]
      } else {
        nextFocusableElement =
          focusedIndex === 0
            ? focusableArray[focusableArray.length - 1]
            : focusableArray[focusedIndex - 1]
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
    onArrowLeftRight: handleArrowLeftRight
  }
}
