import { useChat } from "../hooks";
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
  undefined
);

interface TriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  initialPrompt?: string;
  children?: React.ReactNode;
}

function Trigger({ initialPrompt, onClick, children, ...rest }: TriggerProps) {
  const { ask } = useChat();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (initialPrompt && !e.defaultPrevented) {
      ask({ query: initialPrompt });
    }
  };

  return (
    <button type="button" onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  backdrop?: boolean;
  children: ReactNode;
}

function Wrapper({
  open,
  onClose,
  className,
  children,
  ...rest
}: WrapperProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!panelRef.current) return;
    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusable = Array.from(focusableElements).filter(
      (el) => el.tabIndex !== -1
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
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        panelRef.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <SlidingPanelContext.Provider value={{ open, onClose, panelRef }}>
      <div
        ref={panelRef}
        tabIndex={open ? 0 : -1}
        aria-modal={open ? "true" : "false"}
        role="dialog"
        {...(!open && { inert: true })}
        className={`orama:fixed orama:right-0 orama:top-0 orama:bottom-0 orama:z-50 orama:h-full orama:w-full orama:overflow-hidden ${className || ""}`}
        style={{
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
        {...rest}
      >
        {children}
      </div>
    </SlidingPanelContext.Provider>
  );
}

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  position?: "left" | "right" | "top" | "bottom";
}

function Content({
  children,
  className,
  position = "bottom",
  ...rest
}: ContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ctx = useContext(SlidingPanelContext);
  if (!ctx)
    throw new Error(
      "SlidingPanel.Content must be used within SlidingPanel.Wrapper"
    );

  const { open } = ctx;

  useEffect(() => {
  let animationTimeout: ReturnType<typeof setTimeout>;
  let visibilityTimeout: ReturnType<typeof setTimeout>;

    if (open) {
      setIsVisible(true);
      animationTimeout = setTimeout(() => setIsAnimating(true), 100);
    } else {
      setIsAnimating(false);
      visibilityTimeout = setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      if (animationTimeout) clearTimeout(animationTimeout);
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
    };
  }, [open]);

  let translateClosed;
  let translateOpen;

  switch (position) {
    case "left":
      translateClosed = "translateX(-100%)";
      translateOpen = "translateX(0)";
      break;
    case "right":
      translateClosed = "translateX(100%)";
      translateOpen = "translateX(0)";
      break;
    case "top":
      translateClosed = "translateY(-100%)";
      translateOpen = "translateY(0)";
      break;
    default:
      translateClosed = "translateY(100%)";
      translateOpen = "translateY(0)";
      break;
  }

  return (
    <div
      className={`orama:w-full orama:fixed orama:transition-transform orama:z-50 ${className || ""}`}
      style={{
        transform: isAnimating ? translateOpen : translateClosed,
        bottom: position === "top" ? "auto" : 0,
        left: position === "left" ? 0 : "auto",
        right: position === "right" ? 0 : "auto",
        top: position === "top" ? 0 : "auto",
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none",
      }}
      {...(!open && { inert: true })}
      {...rest}
    >
      {children}
    </div>
  );
}

function Backdrop({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(SlidingPanelContext);
  if (!ctx)
    throw new Error(
      "SlidingPanel.Backdrop must be used within SlidingPanel.Wrapper"
    );

  return (
    <div
      onClick={ctx.open ? ctx.onClose : undefined}
      className={`orama:z-40 ${className || ""}`}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        visibility: ctx.open ? "visible" : "hidden",
        pointerEvents: ctx.open ? "auto" : "none",
      }}
      {...(!ctx.open && { inert: true })}
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
      "SlidingPanel.Close must be used within SlidingPanel.Wrapper"
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
      {children}
    </button>
  );
}

export const SlidingPanel = {
  Trigger,
  Wrapper,
  Content,
  Close,
  Backdrop,
};
