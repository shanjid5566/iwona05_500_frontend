import { useContext } from 'react';
import AppContext from './AppContext';
import UserContext from './UserContext';

/**
 * Custom hook to use App Context
 * Throws error if used outside of AppProvider
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

/**
 * Custom hook to use User Context
 * Throws error if used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
