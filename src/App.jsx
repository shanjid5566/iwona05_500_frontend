import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import AppRouter from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'lenis/dist/lenis.css';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Main App Component
 * Wraps application with Context Providers and Router
 */
function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Disable browser scroll restoration globally
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      infinite: false,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Expose Lenis globally for ScrollToTop component
    window.lenis = lenis;

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      window.lenis = null;
      
      // Restore browser scroll restoration on unmount
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <AppProvider>
      <UserProvider>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={3}
          className="custom-toast-container"
        />
      </UserProvider>
    </AppProvider>
  );
}

export default App;
