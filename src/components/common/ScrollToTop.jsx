import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component - Production Grade
 * 
 * Aggressively resets scroll position on route changes
 * Handles Lenis smooth scroll library conflicts
 * Prevents scroll position restoration from lazy-loaded components
 * 
 * Technical approach:
 * 1. useLayoutEffect executes BEFORE browser paint (prevents visual jump)
 * 2. Disables browser's automatic scroll restoration
 * 3. Multiple execution points to handle async component loading
 * 4. Properly manages Lenis smooth scroll API
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  // Disable browser's built-in scroll restoration
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Primary scroll reset - runs BEFORE browser paint
  useLayoutEffect(() => {
    // Immediate execution - no delay
    if (window.lenis) {
      // Stop Lenis animations first
      window.lenis.stop();
      
      // Force immediate scroll to top
      window.lenis.scrollTo(0, { 
        immediate: true,
        duration: 0,
        force: true,
        lock: false
      });
      
      // Restart Lenis
      window.lenis.start();
    }
    
    // Also set native scroll (Lenis uses this internally)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  // Secondary scroll reset - runs AFTER paint (catches lazy-loaded content)
  useEffect(() => {
    const scrollToTop = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { 
          immediate: true,
          duration: 0,
          force: true
        });
      }
      window.scrollTo(0, 0);
    };

    // Execute immediately
    scrollToTop();
    
    // Also execute after a brief delay to catch lazy-loaded components
    const timers = [
      setTimeout(scrollToTop, 10),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
