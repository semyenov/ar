import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to set Authorization header
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Get the token from localStorage
  const token = localStorage.getItem('auth.token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle errors globally here
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/auth/sign-in';
    }

    return Promise.reject(error);
  }
);

// Export the custom instance function for orval
export const customInstance = <T>(
  config: any,
  options?: any
): Promise<T> => {
  const promise = axiosInstance({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};