import { useRef, useState, useEffect, useCallback } from "react";

export function useScrollableContainer({
  onScrollToBottom,
  onGoToBottomButtonChange,
}: {
  onScrollToBottom?: () => void;
  onGoToBottomButtonChange?: (show: boolean) => void;
} = {}) {
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [showGoToBottomButton, setShowGoToBottomButton] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lockScrollOnBottom, setLockScrollOnBottom] = useState(false);
  const prevScrollTop = useRef(0);

  // Easing function for smooth scroll animation
  const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const calculateIsScrollOnBottom = useCallback(() => {
    const el = containerElement;
    if (!el) return false;
    const scrollableHeight = el.scrollHeight - el.clientHeight;
    // Account for sub-pixel rounding differences across browsers/mobile
    const threshold = 2; // px
    return scrollableHeight - el.scrollTop <= threshold;
  }, [containerElement]);

  const calculateIsContainerOverflowing = useCallback(() => {
    const el = containerElement;
    if (!el) return false;
    const isOverflowing = el.scrollHeight > el.clientHeight;
    return isOverflowing;
  }, [containerElement]);

  const recalculateGoToBottomButton = useCallback(() => {
    const isOverflowing = calculateIsContainerOverflowing();
    if (!isOverflowing) {
      setShowGoToBottomButton(false);
      onGoToBottomButtonChange?.(false);
      return;
    }
    const show = !calculateIsScrollOnBottom();
    setShowGoToBottomButton(show);
    onGoToBottomButtonChange?.(show);
  }, [
    calculateIsContainerOverflowing,
    calculateIsScrollOnBottom,
    onGoToBottomButtonChange,
  ]);

  const scrollToBottom = useCallback(
    ({
      animated = true,
      onScrollDone,
    }: { animated?: boolean; onScrollDone?: () => void } = {}) => {
      const el = containerElement;

      if (!el) return;

      if (!animated) {
        el.scrollTop = el.scrollHeight;
        onScrollDone?.();
        onScrollToBottom?.();
        return;
      }

      setIsScrolling(true);
      const startTime = performance.now();
      const startPosition = el.scrollTop;
      const scrollTarget = el.scrollHeight - el.clientHeight;
      const duration = 300;

      function animateScroll(currentTime: number) {
        if (!containerElement) return;
        const elapsedTime = currentTime - startTime;
        const scrollProgress = Math.min(1, elapsedTime / duration);
        const ease = easeInOutQuad(scrollProgress);
        const scrollTo = startPosition + (scrollTarget - startPosition) * ease;
        el?.scrollTo(0, scrollTo);
        if (elapsedTime < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          setIsScrolling(false);
          onScrollDone?.();
          onScrollToBottom?.();
        }
      }
      requestAnimationFrame(animateScroll);
      setShowGoToBottomButton(false);
    },
    [onScrollToBottom, containerElement],
  );

  // General scroll handler (wheel/touch/scroll)
  const handleScroll = useCallback(() => {
    const el = containerElement;
    if (!el) return;
    const isOverflowing = calculateIsContainerOverflowing();
    if (!isOverflowing) {
      setLockScrollOnBottom(false);
      setShowGoToBottomButton(false);
      onGoToBottomButtonChange?.(false);
      return;
    }
    setShowGoToBottomButton(!calculateIsScrollOnBottom());
    setLockScrollOnBottom(calculateIsScrollOnBottom());
    prevScrollTop.current = el.scrollTop;
  }, [
    containerElement,
    calculateIsContainerOverflowing,
    calculateIsScrollOnBottom,
    onGoToBottomButtonChange,
  ]);

  // Attach listeners
  useEffect(() => {
    const el = containerElement;
    if (!el) return;
    el.addEventListener("wheel", handleScroll, { passive: true });
    el.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("touchmove", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleScroll as EventListener);
      el.removeEventListener("scroll", handleScroll as EventListener);
      el.removeEventListener("touchmove", handleScroll as EventListener);
    };
  }, [handleScroll, containerElement]);

  // Resize observer for container
  useEffect(() => {
    const el = containerElement;
    if (!el) return;
    const observer = new window.ResizeObserver(() => {
      recalculateGoToBottomButton();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [recalculateGoToBottomButton, containerElement]);

  // Callback ref to be used in JSX
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  return {
    containerRef,
    containerElement,
    showGoToBottomButton,
    scrollToBottom,
    isScrolling,
    lockScrollOnBottom,
    setLockScrollOnBottom,
    recalculateGoToBottomButton,
  };
}
