import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Application Context for global state management
 * Manages app-wide state including loading and notifications
 */
const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  // Set global loading state
  const setGlobalLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const value = {
    isLoading,
    setGlobalLoading,
    notifications,
    addNotification,
    removeNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContext;
