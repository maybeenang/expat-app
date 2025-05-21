import axios from 'axios';
import {useAuthStore} from '../store/useAuthStore';
import type {ApiResponse} from '../types/auth';
import {BASE_URL} from '../contants/endpoints';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const response = await axios.post(`${BASE_URL}/auth/refresh`);
        const {token} = response.data;

        // Update token in store
        useAuthStore
          .getState()
          .setAuthData(token, useAuthStore.getState().userSession!);

        // Retry original request with new token
        originalRequest.headers['x-token'] = token;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Special case for login endpoint since it uses FormData
export const loginClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

// Simulated API client
export const apiClientMock = {
  // Simulated GET request
  get: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    await delay(1000); // Simulate network delay

    // Simulate different endpoints
    if (url.includes('/users')) {
      return {
        data: mockUsers as T,
        message: 'Users retrieved successfully',
        status: 200,
      };
    }

    if (url.includes('/auth/me')) {
      return {
        data: mockUsers[0] as T,
        message: 'Current user retrieved successfully',
        status: 200,
      };
    }

    throw new Error('Endpoint not found');
  },

  // Simulated POST request
  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    await delay(1000); // Simulate network delay

    // Simulate different endpoints
    if (url.includes('/auth/login')) {
      const {email, password} = data;
      const user = mockUsers.find(u => u.email === email);

      if (user && password === 'password123') {
        return {
          data: {
            user,
            token: 'mock-jwt-token',
          } as T,
          message: 'Login successful',
          status: 200,
        };
      }

      throw new Error('Invalid credentials');
    }

    if (url.includes('/auth/register')) {
      return {
        data: {
          user: {
            id: '3',
            ...data,
            role: 'user',
          },
          token: 'mock-jwt-token',
        } as T,
        message: 'Registration successful',
        status: 200,
      };
    }

    if (url.includes('/auth/logout')) {
      return {
        data: {} as T,
        message: 'Logout successful',
        status: 200,
      };
    }

    if (url.includes('/auth/refresh')) {
      return {
        data: {token: 'new-mock-jwt-token'} as T,
        message: 'Token refreshed successfully',
        status: 200,
      };
    }

    throw new Error('Endpoint not found');
  },

  // Simulated PUT request
  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    await delay(1000);
    return {
      data: data as T,
      message: 'Update successful',
      status: 200,
    };
  },

  // Simulated DELETE request
  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    await delay(1000);
    return {
      data: {} as T,
      message: 'Delete successful',
      status: 200,
    };
  },
};

export default apiClient;
