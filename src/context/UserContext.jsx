import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Local storage keys (moved from app.constants.js)
const STORAGE_KEYS = { USER: 'app_user', TOKEN: 'app_token' };

/**
 * User Context for authentication and user state management
 */
const UserContext = createContext(undefined);

// Initialize user state from localStorage
const initializeUser = () => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return { user: parsedUser, isAuthenticated: true };
    }
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
  return { user: null, isAuthenticated: false };
};

export const UserProvider = ({ children }) => {
  const initialState = initializeUser();
  const [user, setUser] = useState(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);

  // Login user
  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, []);

  // Clear user state but preserve token (for payment retry scenarios)
  const clearUserOnly = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Note: Token is NOT removed - kept for payment retry
  }, []);

  // Update user profile
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    clearUserOnly,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
