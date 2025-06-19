import React, { useRef, useEffect, useCallback } from 'react';

export interface ModalStatus {
  open: boolean;
  id: HTMLElement;
}

interface OramaModalProps {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  mainTitle?: string;
  onModalClosed: () => void;
  open?: boolean;
  children?: React.ReactNode;
}

const Modal: React.FC<OramaModalProps> = ({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onModalClosed,
  children,
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

  const handleCloseClick = useCallback(() => {
    onModalClosed();
  }, [onModalClosed]);

  // Effect to handle component mount/unmount (equivalent to connectedCallback/disconnectedCallback)
  useEffect(() => {
    // Store original body overflow state
    originalBodyOverflowRef.current = document.body.style.overflow;
    
    // Store currently active element
    activeElementRef.current = document.activeElement as HTMLElement;
    
    // Set body overflow to hidden and focus first element
    document.body.style.overflow = 'hidden';
    handleFocus();

    // Cleanup function (equivalent to disconnectedCallback)
    return () => {
      document.body.style.overflow = originalBodyOverflowRef.current;
      
      // Restore focus to original element
      if (activeElementRef.current) {
        activeElementRef.current.focus();
      }
    };
  }, [handleFocus]);

  // Effect to handle focus when component updates
  useEffect(() => {
    handleFocus();
  });

  if (!open) {
    return null; // Do not render the modal if not open
  }

  return (
    <dialog
      ref={modalRef}
      className="modal open"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-describedby="modalContent"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        ref={innerModalRef}
        className="modal-inner"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <div id="modalContent" className="modal-content" style={{ marginBottom: '16px' }}>
          {children}
        </div>
        <button 
          onClick={handleCloseClick} 
          type="button" 
          className="modal-close"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            border: 'none',
            background: 'transparent',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default Modal;