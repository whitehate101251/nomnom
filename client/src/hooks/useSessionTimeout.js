import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const useSessionTimeout = (timeoutMinutes = 30) => {
  const navigate = useNavigate();
  
  const resetTimer = useCallback(() => {
    localStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  const checkTimeout = useCallback(() => {
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
    const now = Date.now();
    const timeoutMs = timeoutMinutes * 60 * 1000;

    if (now - lastActivity > timeoutMs) {
      AuthService.logout();
      navigate('/login', { 
        state: { message: 'Session expired. Please log in again.' }
      });
    }
  }, [timeoutMinutes, navigate]);

  useEffect(() => {
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll'
    ];

    // Set initial activity timestamp
    resetTimer();

    // Check for timeout every minute
    const intervalId = setInterval(checkTimeout, 60000);

    // Reset timer on user activity
    const handleActivity = () => resetTimer();
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(intervalId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, checkTimeout]);
};

export default useSessionTimeout; 