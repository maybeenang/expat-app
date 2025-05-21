import type {LoginCredentials, AuthResponse, User} from '../types/auth';
import {apiClient, loginClient} from './apiClient';
import type {LoginResponse, ApiError} from '../types/auth';
import {LOGIN_ENDPOINT} from '../contants/endpoints';
import axios from 'axios';

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await loginClient.post<LoginResponse>(
        LOGIN_ENDPOINT,
        credentials,
      );

      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      credentials,
    );
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{token: string}> {
    const response = await apiClient.post<{token: string}>('/auth/refresh');
    return response.data;
  }
}

export const authService = new AuthService();
