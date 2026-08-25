import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal, drawer or popover is open.
 * Prevents background page shifting and touch scrolling on mobile.
 */
export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    // Save original styles
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to avoid layout shift on desktop
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply scroll lock styles
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup on unmount or when unlocked
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};
