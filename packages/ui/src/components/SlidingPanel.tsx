import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  HTMLAttributes,
  useState,
} from "react";

interface SlidingPanelContextProps {
  open: boolean;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const SlidingPanelContext = createContext<SlidingPanelContextProps | undefined>(
  undefined,
);

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  backdrop?: boolean;
  children: ReactNode;
}

// function Wrapper({ open, onClose, className, children, ...rest }: WrapperProps) {
//   const panelRef = useRef<HTMLDivElement>(null)
//   const [isVisible, setIsVisible] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // Trap focus inside the panel
//   const trapFocus = useCallback((event: KeyboardEvent) => {
//     if (!panelRef.current) return
//     const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
//       'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
//     )
//     const focusable = Array.from(focusableElements).filter(el => el.tabIndex !== -1)
//     if (focusable.length === 0) return

//     const first = focusable[0]
//     const last = focusable[focusable.length - 1]
//     const active = document.activeElement

//     if (event.shiftKey && active === first) {
//       event.preventDefault()
//       last?.focus()
//     } else if (!event.shiftKey && active === last) {
//       event.preventDefault()
//       first?.focus()
//     }
//   }, [])

//   // Handle keydown for Escape and Tab
//   useEffect(() => {
//     if (!open) return

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         event.stopPropagation()
//         onClose()
//       } else if (event.key === 'Tab') {
//         trapFocus(event)
//       }
//     }

//     document.addEventListener('keydown', handleKeyDown, true)
//     return () => document.removeEventListener('keydown', handleKeyDown, true)
//   }, [open, onClose, trapFocus])

//   // Focus panel when opened
//   useEffect(() => {
//     if (open && panelRef.current) {
//       // Focus the first focusable element or the panel itself
//       const focusable = panelRef.current.querySelector<HTMLElement>(
//         'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
//       )
//       if (focusable) {
//         focusable.focus()
//       } else {
//         panelRef.current.focus()
//       }
//     }
//   }, [open])

//   useEffect(() => {
//     if (open) {
//       console.log('Opening sliding panel');
//       setIsVisible(true);
//       setTimeout(() => setIsAnimating(true), 10);
//     } else {
//       setIsAnimating(false);
//       setTimeout(() => setIsVisible(false), 400);
//     }
//   }, [open]);

//   if (!panelRef || !isVisible) return null

//   return (
//     <SlidingPanelContext.Provider value={{ open, onClose, panelRef }}>
//       {/* Panel */}
//       <div
//         ref={panelRef}
//         tabIndex={open ? 0 : -1}
//         aria-modal="true"
//         role="dialog"
//         aria-hidden={!open}
//         className={`fixed right-0 top-0 bottom-0 z-50 h-full w-full overflow-hidden ${className}`}
//         {...rest}
//       >

//         <div
//           className="w-full max-w-xl mx-auto bg-white rounded-t-lg shadow-lg fixed bottom left-1/2 -translate-x-1/2 z-70 overflow-hidden"
//           style={{
//             height: '95vh',
//             transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
//             transition: 'transform cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
//             bottom: 0,
//           }}
//         >
//           {children}
//         </div>
//       </div>
//     </SlidingPanelContext.Provider>
//   )
// }

function Wrapper({
  open,
  onClose,
  className,
  children,
  ...rest
}: WrapperProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Trap focus inside the panel
  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!panelRef.current) return;
    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const focusable = Array.from(focusableElements).filter(
      (el) => el.tabIndex !== -1,
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }, []);

  // Handle keydown for Escape and Tab
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      } else if (event.key === "Tab") {
        trapFocus(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onClose, trapFocus]);

  // Focus panel when opened
  useEffect(() => {
    if (open && panelRef.current) {
      // Focus the first focusable element or the panel itself
      const focusable = panelRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) {
        focusable.focus();
      } else {
        panelRef.current.focus();
      }
    }
  }, [open]);

  if (!panelRef || !open) return null;

  return (
    <SlidingPanelContext.Provider value={{ open, onClose, panelRef }}>
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={open ? 0 : -1}
        aria-modal="true"
        role="dialog"
        aria-hidden={!open}
        className={`fixed right-0 top-0 bottom-0 z-50 h-full w-full overflow-hidden ${className || ""}`}
        {...rest}
      >
        {children}
      </div>
    </SlidingPanelContext.Provider>
  );
}

function Content({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ctx = useContext(SlidingPanelContext);
  if (!ctx)
    throw new Error(
      "SlidingPanel.Content must be used within SlidingPanel.Wrapper",
    );

  const { open } = ctx;

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 400);
    }
  }, [open]);

  if (!isVisible) return null;

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-t-lg shadow-lg fixed bottom left-1/2 -translate-x-1/2 z-50 ${className || ""}`}
      style={{
        height: "95vh",
        transform: isAnimating ? "translateY(0)" : "translateY(100%)",
        transition: "transform cubic-bezier(0.4, 0, 0.2, 1) 0.4s",
        bottom: 0,
      }}
    >
      <div
        id="panel"
        aria-hidden={!ctx.open}
        tabIndex={-1}
        className={`p-6 overflow-y-auto h-full`}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}

// function Content({ children, className, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
//   const ctx = useContext(SlidingPanelContext)
//   if (!ctx) throw new Error('SlidingPanel.Content must be used within SlidingPanel.Wrapper')
//   return (
//     <div
//       id="panel"
//       aria-hidden={!ctx.open}
//       tabIndex={-1}
//       className={`p-6 overflow-y-auto h-full ${className || ''}`}
//       {...rest}
//     >
//       {children}
//     </div>
//   )
// }

function Backdrop({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(SlidingPanelContext);
  if (!ctx)
    throw new Error(
      "SlidingPanel.Backdrop must be used within SlidingPanel.Wrapper",
    );
  if (!ctx.open) return null;

  return (
    <div
      onClick={ctx.onClose}
      className={`fixed right-0 top-0 bottom-0 bg-black bg-opacity-50 w-full h-full z-40 ${className || ""}`}
      aria-hidden={!ctx.open}
      {...rest}
    />
  );
}

function Close({
  children,
  className,
  ...rest
}: { children?: ReactNode } & HTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(SlidingPanelContext);
  if (!ctx)
    throw new Error(
      "SlidingPanel.Close must be used within SlidingPanel.Wrapper",
    );
  return (
    <button
      onClick={ctx.onClose}
      aria-expanded={ctx.open}
      aria-label="Close panel"
      aria-controls="panel"
      type="button"
      className={className}
      {...rest}
    >
      {children ?? (
        <span aria-hidden="true" className="text-2xl">
          &times;
        </span>
      )}
    </button>
  );
}

export const SlidingPanel = {
  Wrapper,
  Content,
  Close,
  Backdrop,
};
