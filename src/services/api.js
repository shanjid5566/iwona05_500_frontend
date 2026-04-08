import axios from 'axios';

// Local constants (moved from app.constants.js)
const API_TIMEOUT = 30000; // 30 seconds
const STORAGE_KEYS = { USER: 'app_user', TOKEN: 'app_token' };

/**
 * Centralized Axios instance with interceptors
 * Handles authentication, error handling, and request/response transformation
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('[REQUEST]', config.method.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('[ERROR] Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles success and error responses globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('[SUCCESS] Response:', response.config.url, response.status);
      console.log('[SUCCESS] Response data:', response.data);
    }
    
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`[ERROR ${status}]`, error.config.url);
      console.error('[ERROR] Response data:', data);
      
      switch (status) {
        case 401:
          // Unauthorized - only redirect if not on login page
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('[ERROR] Forbidden:', data.message || 'Access denied');
          break;
        case 404:
          console.error('[ERROR] Not Found:', error.config.url);
          break;
        case 500:
          console.error('[ERROR] Server Error:', data.message || 'Internal server error');
          break;
        default:
          console.error('[ERROR] Error:', data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response received (CORS or Network issue)
      console.error('[ERROR] Network/CORS Error - No response from server');
      console.error('[ERROR] Request details:', error.request);
      console.error('[ERROR] Please check:');
      console.error('  1. Backend server is running');
      console.error('  2. CORS is enabled on backend');
      console.error('  3. Backend URL is correct:', import.meta.env.VITE_API_BASE_URL);
    } else {
      // Error in request configuration
      console.error('[ERROR] Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request methods
 */
export const api = {
  /**
   * GET request
   */
  get: (url, config = {}) => apiClient.get(url, config),
  
  /**
   * POST request
   */
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  
  /**
   * PUT request
   */
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  
  /**
   * PATCH request
   */
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  
  /**
   * DELETE request
   */
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
