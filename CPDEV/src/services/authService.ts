import axios, {AxiosError} from 'axios';
import type {
  LoginCredentials,
  LoginApiResponse,
  LoginApiResponseData,
  ApiErrorData,
} from '../types/auth';
import {LOGIN_ENDPOINT} from '../contants/endpoints';
import apiClient from './apiClient';

export const loginApiCall = async (
  credentials: LoginCredentials,
): Promise<LoginApiResponseData> => {
  try {
    const response = await apiClient.post<LoginApiResponse>(
      LOGIN_ENDPOINT,
      credentials,
    );

    if (
      response.data &&
      response.data.status === 200 &&
      response.data.data?.['x-token']
    ) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response data');
    }
  } catch (error) {
    if (axios.isAxiosError<ApiErrorData>(error) && error.response) {
      throw new AxiosError(
        error.response.data.message || 'Network error',
        error.code,
        error.request,
        error.response,
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

export default apiClient;
