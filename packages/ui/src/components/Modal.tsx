import React, {
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useArrowKeysNavigation } from "../hooks";

export interface ModalStatus {
  open: boolean;
  id: HTMLElement;
}

interface ModalContextType {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  innerModalRef: React.RefObject<HTMLDivElement | null>;
  onModalClosed: () => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  trapFocus: (event: KeyboardEvent) => void;
  handleFocus: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within Modal.Wrapper");
  }
  return context;
};

interface ModalWrapperProps extends React.HTMLAttributes<HTMLDialogElement> {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onModalClosed: () => void;
  open?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onModalClosed,
  children,
  className,
  open = false,
  ...rest
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const innerModalRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const originalBodyOverflowRef = useRef<string>("scroll");
  const firstFocusableElementRef = useRef<HTMLElement | null>(null);
  const lastFocusableElementRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusableArray = (
      Array.from(focusableElements) as HTMLElement[]
    ).filter((element) => element.offsetParent !== null);

    if (focusableArray.length > 0) {
      firstFocusableElementRef.current = focusableArray[0] ?? null;
      lastFocusableElementRef.current =
        focusableArray[focusableArray.length - 1] ?? null;

      const focusedElement = modalRef.current.querySelector(
        ":focus"
      ) as HTMLElement;

      if (
        event.shiftKey &&
        focusedElement === firstFocusableElementRef.current
      ) {
        event.preventDefault();
        lastFocusableElementRef.current?.focus();
      } else if (
        !event.shiftKey &&
        focusedElement === lastFocusableElementRef.current
      ) {
        event.preventDefault();
        firstFocusableElementRef.current?.focus();
      }
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusableArray = (
      Array.from(focusableElements) as HTMLElement[]
    ).filter((element) => element.offsetParent !== null);

    if (focusableArray.length > 0) {
      focusableArray[0]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "Tab":
          trapFocus(event.nativeEvent);
          break;
        case "Escape":
          if (closeOnEscape) {
            event.preventDefault();
            event.stopPropagation();
            onModalClosed();
          }
          break;
      }
    },
    [closeOnEscape, onModalClosed, trapFocus]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (
        closeOnOutsideClick &&
        innerModalRef.current &&
        !innerModalRef.current.contains(event.target as Node)
      ) {
        event.stopPropagation();
        event.preventDefault();
        onModalClosed();
      }
    },
    [closeOnOutsideClick, onModalClosed]
  );

  useEffect(() => {
    if (!open) return;

    originalBodyOverflowRef.current = document.body.style.overflow;

    activeElementRef.current = document.activeElement as HTMLElement;

    document.body.style.overflow = "hidden";
    handleFocus();

    return () => {
      document.body.style.overflow = originalBodyOverflowRef.current;
      if (activeElementRef.current) {
        activeElementRef.current.focus();
      }
    };
  }, [open, handleFocus]);

  useEffect(() => {
    if (open) {
      handleFocus();
    }
  }, [open, handleFocus]);

  if (!open) {
    return null;
  }

  const contextValue: ModalContextType = {
    modalRef,
    innerModalRef,
    onModalClosed,
    closeOnEscape,
    closeOnOutsideClick,
    trapFocus,
    handleFocus,
  };

  if (!open) {
    return null;
  }

  return (
    <ModalContext.Provider value={contextValue}>
      <dialog
        ref={modalRef}
        aria-modal="true"
        aria-describedby="modalContent"
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={`orama:fixed orama:left-0 orama:right-0 orama:bg-gray-500 orama:bg-opacity-50 orama:w-full orama:h-full orama:inset-0 orama:border-none orama:m-0 orama:p-0 orama:flex orama:z-50 ${className || ""}`}
        {...rest}
      >
        {children}
      </dialog>
    </ModalContext.Provider>
  );
};

interface ModalInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ModalInner: React.FC<ModalInnerProps> = ({
  className = "",
  children,
  ...rest
}) => {
  const { innerModalRef } = useModalContext();
  const { ref, onKeyDown } = useArrowKeysNavigation();

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown(event.nativeEvent);
  };

  return (
    <div
      ref={innerModalRef}
      onKeyDown={handleKeyDown}
      className={`orama:rounded-lg orama:shadow-lg orama:m-auto orama:max-w-3xl orama:w-full orama:relative ${className}`}
      role="dialog"
      aria-modal="true"
      {...rest}
    >
      <section ref={ref} className="orama:w-full orama:relative">
        {children}
      </section>
    </div>
  );
};

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ModalContent: React.FC<ModalContentProps> = ({
  className = "",
  children,
  ...rest
}) => {
  return (
    <div
      id="modalContent"
      className={`orama:w-full orama:h-full ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

interface ModalCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ModalClose: React.FC<ModalCloseProps> = ({
  className = "",
  children = "×",
  ...rest
}) => {
  const { onModalClosed } = useModalContext();

  const handleClick = useCallback(() => {
    onModalClosed();
  }, [onModalClosed]);

  return (
    <button
      onClick={handleClick}
      type="button"
      className={className}
      aria-label="Close modal"
      {...rest}
    >
      {children}
    </button>
  );
};

export const Modal = {
  Wrapper: ModalWrapper,
  Inner: ModalInner,
  Content: ModalContent,
  Close: ModalClose,
};
