import { useState, useCallback } from 'react';

const useErrorHandler = (initialState = null) => {
  const [error, setError] = useState(initialState);

  const handleError = useCallback((error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          setError('Invalid request. Please check your input.');
          break;
        case 401:
          setError('Please log in to continue.');
          break;
        case 403:
          setError('You do not have permission to perform this action.');
          break;
        case 404:
          setError('The requested resource was not found.');
          break;
        case 429:
          setError('Too many requests. Please try again later.');
          break;
        case 500:
          setError('Server error. Please try again later.');
          break;
        default:
          setError('An unexpected error occurred.');
      }
    } else if (error.request) {
      // Request was made but no response received
      setError('Unable to connect to the server. Please check your internet connection.');
    } else {
      // Error in request setup
      setError('An error occurred while processing your request.');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

export default useErrorHandler; 