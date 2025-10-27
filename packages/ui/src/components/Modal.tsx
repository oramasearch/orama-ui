import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext
} from 'react'
import { useArrowKeysNavigation } from '../hooks'

export interface ModalStatus {
  open: boolean
  id: HTMLElement
}

interface ModalContextType {
  innerModalRef: React.RefObject<HTMLDivElement | null>
  onModalClosed: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

const useModalContext = () => {
  const context = useContext(ModalContext)
  return context
}

interface ModalRootProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

const ModalRoot = ({ children, defaultOpen }: ModalRootProps) => {
  const [open, setOpenState] = React.useState(defaultOpen || false)
  const innerModalRef = useRef<HTMLDivElement>(null)

  const onModalClosed = useCallback(() => {
    setOpenState(false)
  }, [setOpenState])

  const contextValue = {
    open,
    setOpen: setOpenState,
    onModalClosed,
    innerModalRef
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}

interface ModalTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  enableCmdK?: boolean
}

const ModalTrigger = ({
  className = '',
  children,
  enableCmdK = false,
  onClick,
  onKeyDown,
  ...rest
}: ModalTriggerProps) => {
  const context = useModalContext()

  const setLocalOpen = context?.setOpen

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setLocalOpen?.(true)
      onClick?.(event)
    },
    [setLocalOpen, onClick]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setLocalOpen?.(true)
      }
      onKeyDown?.(event)
    },
    [setLocalOpen, onKeyDown]
  )

  useEffect(() => {
    if (!enableCmdK) return

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setLocalOpen?.(true)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [enableCmdK, setLocalOpen])

  return (
    <button
      type='button'
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
      {...rest}
    >
      {children}
    </button>
  )
}

interface ModalWrapperProps extends React.HTMLAttributes<HTMLDialogElement> {
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  onModalClosed?: () => void
  open?: boolean
  children: React.ReactNode
  className?: string
}

const ModalWrapper = ({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onModalClosed: propOnModalClosed,
  children,
  className,
  open: propOpen = false,
  ...rest
}: ModalWrapperProps) => {
  const modalRef = useRef<HTMLDialogElement>(null)
  const innerModalRef = useRef<HTMLDivElement>(null)
  const activeElementRef = useRef<HTMLElement | null>(null)
  const originalBodyOverflowRef = useRef<string>('scroll')
  const firstFocusableElementRef = useRef<HTMLElement | null>(null)
  const lastFocusableElementRef = useRef<HTMLElement | null>(null)
  const [localOpen, setLocalOpen] = React.useState(propOpen)
  const context = useModalContext()
  const open = context?.open ?? propOpen ?? localOpen
  const setOpen = context?.setOpen ?? setLocalOpen
  const onModalClosed = useMemo(
    () =>
      context?.onModalClosed ??
      propOnModalClosed ??
      (() => setLocalOpen(false)),
    [context?.onModalClosed, propOnModalClosed, setLocalOpen]
  )

  const innerModalRefToUse = context?.innerModalRef ?? innerModalRef

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const focusableArray = (
      Array.from(focusableElements) as HTMLElement[]
    ).filter((element) => element.offsetParent !== null)

    if (focusableArray.length > 0) {
      firstFocusableElementRef.current = focusableArray[0] ?? null
      lastFocusableElementRef.current =
        focusableArray[focusableArray.length - 1] ?? null

      const focusedElement = modalRef.current.querySelector(
        ':focus'
      ) as HTMLElement

      if (
        event.shiftKey &&
        focusedElement === firstFocusableElementRef.current
      ) {
        event.preventDefault()
        lastFocusableElementRef.current?.focus()
      } else if (
        !event.shiftKey &&
        focusedElement === lastFocusableElementRef.current
      ) {
        event.preventDefault()
        firstFocusableElementRef.current?.focus()
      }
    }
  }, [])

  const handleFocus = useCallback(() => {
    if (!modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const focusableArray = (
      Array.from(focusableElements) as HTMLElement[]
    ).filter((element) => element.offsetParent !== null)

    if (focusableArray.length > 0) {
      focusableArray[0]?.focus()
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Tab':
          trapFocus(event.nativeEvent)
          break
        case 'Escape':
          if (closeOnEscape) {
            event.preventDefault()
            event.stopPropagation()
            onModalClosed?.()
          }
          break
      }
    },
    [closeOnEscape, onModalClosed, trapFocus]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (
        closeOnOutsideClick &&
        innerModalRefToUse.current &&
        !innerModalRefToUse.current.contains(event.target as Node)
      ) {
        event.stopPropagation()
        event.preventDefault()
        onModalClosed?.()
      }
    },
    [closeOnOutsideClick, innerModalRefToUse, onModalClosed]
  )

  useEffect(() => {
    if (!open) return

    originalBodyOverflowRef.current = document.body.style.overflow

    activeElementRef.current = document.activeElement as HTMLElement

    document.body.style.overflow = 'hidden'
    handleFocus()

    return () => {
      document.body.style.overflow = originalBodyOverflowRef.current
      if (activeElementRef.current) {
        activeElementRef.current.focus()
      }
    }
  }, [open, handleFocus])

  useEffect(() => {
    if (open) {
      handleFocus()
    }
  }, [open, handleFocus])

  const contextValue: ModalContextType = {
    onModalClosed,
    innerModalRef: innerModalRefToUse,
    setOpen,
    open
  }

  if (!open) {
    return null
  }

  const content = (
    <dialog
      ref={modalRef}
      aria-modal='true'
      aria-describedby='modalContent'
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className={`orama:fixed orama:left-0 orama:right-0 orama:bg-gray-500 orama:bg-opacity-50 orama:w-full orama:h-full orama:inset-0 orama:border-none orama:m-0 orama:p-0 orama:flex orama:z-50 ${className || ''}`}
      {...rest}
    >
      {children}
    </dialog>
  )

  if (context) {
    return content
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {content}
    </ModalContext.Provider>
  )
}

interface ModalInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const ModalInner = ({ className = '', children, ...rest }: ModalInnerProps) => {
  const localInnerModalRef = useRef<HTMLDivElement>(null)
  const context = useModalContext()
  const innerModalRef = context?.innerModalRef ?? localInnerModalRef
  const { ref, onKeyDown } = useArrowKeysNavigation()

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown(event.nativeEvent)
  }

  return (
    <div
      ref={innerModalRef}
      onKeyDown={handleKeyDown}
      className={`orama:rounded-lg orama:shadow-lg orama:m-auto orama:max-w-3xl orama:w-full orama:relative ${className}`}
      role='dialog'
      aria-modal='true'
      {...rest}
    >
      <section ref={ref} className='orama:w-full orama:relative'>
        {children}
      </section>
    </div>
  )
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const ModalContent = ({
  className = '',
  children,
  ...rest
}: ModalContentProps) => {
  return (
    <div
      id='modalContent'
      className={`orama:w-full orama:h-full ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

interface ModalCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const ModalClose = ({
  className = '',
  children = '×',
  ...rest
}: ModalCloseProps) => {
  const context = useModalContext()
  const onModalClosed = context?.onModalClosed

  const handleClick = useCallback(() => {
    onModalClosed?.()
  }, [onModalClosed])

  return (
    <button
      onClick={handleClick}
      type='button'
      className={className}
      aria-label='Close modal'
      {...rest}
    >
      {children}
    </button>
  )
}

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Wrapper: ModalWrapper,
  Inner: ModalInner,
  Content: ModalContent,
  Close: ModalClose
}
