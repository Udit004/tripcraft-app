import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // Server-side: use full URL
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }
  // Client-side: can use relative URL
  return process.env.NEXT_PUBLIC_API_URL || '/api';
};

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor - Cookies are sent automatically with withCredentials: true
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;