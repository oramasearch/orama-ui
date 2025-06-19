import { useArrowKeysNavigation } from '../hooks/useArrowKeyNavigation';
import React, { useRef, useEffect, useCallback, createContext, useContext } from 'react';

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
    throw new Error('Modal components must be used within Modal.Wrapper');
  }
  return context;
};

interface ModalWrapperProps {
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
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const innerModalRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const originalBodyOverflowRef = useRef<string>('scroll');
  const firstFocusableElementRef = useRef<HTMLElement | null>(null);
  const lastFocusableElementRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusableArray = (Array.from(focusableElements) as HTMLElement[]).filter(
      (element) => element.offsetParent !== null
    );

    if (focusableArray.length > 0) {
      firstFocusableElementRef.current = focusableArray[0] ?? null;
      lastFocusableElementRef.current = focusableArray[focusableArray.length - 1] ?? null;

      const focusedElement = modalRef.current.querySelector(':focus') as HTMLElement;

      if (event.shiftKey && focusedElement === firstFocusableElementRef.current) {
        event.preventDefault();
        lastFocusableElementRef.current?.focus();
      } else if (!event.shiftKey && focusedElement === lastFocusableElementRef.current) {
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
    const focusableArray = (Array.from(focusableElements) as HTMLElement[]).filter(
      (element) => element.offsetParent !== null
    );

    if (focusableArray.length > 0) {
      focusableArray[0]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Tab':
        trapFocus(event.nativeEvent);
        break;
      case 'Escape':
        if (closeOnEscape) {
          event.preventDefault();
          event.stopPropagation();
          onModalClosed();
        }
        break;
    }
  }, [closeOnEscape, onModalClosed, trapFocus]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOutsideClick && innerModalRef.current && !innerModalRef.current.contains(event.target as Node)) {
      event.stopPropagation();
      event.preventDefault();
      onModalClosed();
    }
  }, [closeOnOutsideClick, onModalClosed]);

  // Effect to handle component mount/unmount
  useEffect(() => {
    if (!open) return;

    // Store original body overflow state
    originalBodyOverflowRef.current = document.body.style.overflow;

    // Store currently active element
    activeElementRef.current = document.activeElement as HTMLElement;
    // Set body overflow to hidden and focus first element
    document.body.style.overflow = 'hidden';
    handleFocus();

    // Cleanup function
    return () => {
      document.body.style.overflow = originalBodyOverflowRef.current;
      
      // Restore focus to original element
      if (activeElementRef.current) {
        activeElementRef.current.focus();
      }
    };
  }, [open, handleFocus]);

  // Effect to handle focus when component updates
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
        className={`fixed left-0 right-0 bg-gray-500 bg-opacity-50 w-full h-full inset-0 border-none m-0 p-0 flex z-50 ${className || ''}`}
      >
        {children}
      </dialog>
    </ModalContext.Provider>
  );
};

interface ModalInnerProps {
  className?: string;
  children: React.ReactNode;
}

const ModalInner: React.FC<ModalInnerProps> = ({ className = '', children }) => {
  const { innerModalRef } = useModalContext();
  const { ref, onKeyDown } = useArrowKeysNavigation();

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown(event.nativeEvent);
  };

  return (
    <div 
      ref={innerModalRef}
      onKeyDown={handleKeyDown}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg m-auto p-6 max-w-3xl w-full relative ${className}`}
      role="dialog"
      aria-modal="true"
    >
      <section ref={ref} className='w-full relative'>
        {children}
      </section>
    </div>
  );
};

interface ModalContentProps {
  className?: string;
  children: React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ className = '', children }) => {
  return (
    <div id="modalContent" className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
};

interface ModalCloseProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

const ModalClose: React.FC<ModalCloseProps> = ({ 
  className = '', 
  children = '×',
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
    >
      {children}
    </button>
  );
};

const Modal = {
  Wrapper: ModalWrapper,
  Inner: ModalInner,
  Content: ModalContent,
  Close: ModalClose,
};

export default Modal;