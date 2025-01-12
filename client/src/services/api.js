import axios from 'axios';
import localforage from 'localforage';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure cache storage
const cache = localforage.createInstance({
  name: 'api-cache'
});

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHEABLE_METHODS = ['GET'];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
      // You could implement a retry queue here
    }
    return Promise.reject(error);
  }
);

// Add rate limiting handler
let requestsThisMinute = 0;
const MAX_REQUESTS_PER_MINUTE = 60;

setInterval(() => {
  requestsThisMinute = 0;
}, 60000);

// Request interceptor with rate limiting
api.interceptors.request.use(
  (config) => {
    if (requestsThisMinute >= MAX_REQUESTS_PER_MINUTE) {
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }
    requestsThisMinute++;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add cache interceptor
api.interceptors.request.use(async (config) => {
  if (!CACHEABLE_METHODS.includes(config.method?.toUpperCase())) {
    return config;
  }

  const cacheKey = `${config.method}-${config.url}-${JSON.stringify(config.params)}`;
  const cachedResponse = await cache.getItem(cacheKey);

  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    return Promise.reject({
      config,
      response: cachedResponse.data,
      cached: true
    });
  }

  return config;
});

api.interceptors.response.use(
  async (response) => {
    if (CACHEABLE_METHODS.includes(response.config.method?.toUpperCase())) {
      const cacheKey = `${response.config.method}-${response.config.url}-${JSON.stringify(response.config.params)}`;
      await cache.setItem(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    if (error.cached) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    switch (status) {
      case 400:
        return { type: 'validation', message };
      case 401:
        return { type: 'auth', message: 'Please log in to continue' };
      case 403:
        return { type: 'permission', message: 'Access denied' };
      case 404:
        return { type: 'notFound', message: 'Resource not found' };
      case 429:
        return { type: 'rateLimit', message: 'Too many requests' };
      default:
        return { type: 'server', message: 'Server error' };
    }
  }
  
  if (error.request) {
    return {
      type: 'network',
      message: 'Network error. Please check your connection'
    };
  }
  
  return {
    type: 'unknown',
    message: 'An unexpected error occurred'
  };
};

export default api; 