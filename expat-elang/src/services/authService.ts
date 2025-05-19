import axios from 'axios';
import {
  API_BASE_URL,
  LOGIN_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
} from '../constants/api';
import type {
  LoginCredentials,
  LoginApiResponse,
  LoginApiResponseData,
  ApiErrorData,
  RefreshTokenCredentials,
  RefreshTokenApiResponse,
} from '../types/auth';
import {useAuthStore} from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const loginApiCall = async (
  credentials: LoginCredentials,
): Promise<LoginApiResponseData> => {
  try {
    const response = await apiClient.post<LoginApiResponse>(
      LOGIN_ENDPOINT,
      credentials,
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response data');
    }
  } catch (error) {
    if (axios.isAxiosError<ApiErrorData>(error) && error.response) {
      throw new Error(error.response.data?.message || 'Login failed');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const refreshTokenApiCall = async (
  credentials: RefreshTokenCredentials,
) => {
  try {
    const response = await apiClient.post<RefreshTokenApiResponse>(
      REFRESH_TOKEN_ENDPOINT,
      credentials,
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response data');
    }
  } catch (error) {
    if (axios.isAxiosError<ApiErrorData>(error) && error.response) {
      throw new Error(error.response.data?.message || 'Refresh token failed');
    }
    throw new Error('Network error or failed to connect');
  }
};

apiClient.interceptors.request.use(async config => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
