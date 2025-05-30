import axios from 'axios';
import {
  API_BASE_URL,
  LOGIN_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  SIGNUP_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
} from '../constants/api';
import type {
  LoginCredentials,
  LoginApiResponse,
  LoginApiResponseData,
  ApiErrorData,
  RefreshTokenCredentials,
  RefreshTokenApiResponse,
  RegisterCredentials,
  RegisterApiResponse,
  RegisterApiResponseData,
  ForgotPasswordCredentials,
  ForgotPasswordApiResponse,
} from '../types/auth';
import {useAuthStore} from '../store/useAuthStore';
import {useApiKeyStore} from '../store/useApiKeyStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Flag untuk mencegah multiple refresh token calls
let isRefreshing = false;
// Queue untuk menyimpan request yang gagal karena token expired
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

export const registerApiCall = async (
  credentials: RegisterCredentials,
): Promise<RegisterApiResponseData> => {
  try {
    // Create form data for the multipart/form-data request
    const formData = new FormData();
    formData.append('full_name', credentials.full_name);
    formData.append('mobile_phone', credentials.mobile_phone);
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post<RegisterApiResponse>(
      SIGNUP_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.data && response.data.status === '200') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response data');
    }
  } catch (error) {
    if (axios.isAxiosError<ApiErrorData>(error) && error.response) {
      throw new Error(error.response.data?.message || 'Registration failed');
    }
    throw new Error('Network error or failed to connect');
  }
};

export const refreshTokenApiCall = async (
  credentials: RefreshTokenCredentials,
): Promise<{session_token: string}> => {
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

export const forgotPasswordApiCall = async (
  credentials: ForgotPasswordCredentials,
): Promise<ForgotPasswordApiResponse> => {
  try {
    // Create form data for the multipart/form-data request
    const formData = new FormData();
    formData.append('email', credentials.email);

    const response = await apiClient.post<ForgotPasswordApiResponse>(
      FORGOT_PASSWORD_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.data && response.data.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Invalid response data');
    }
  } catch (error) {
    if (axios.isAxiosError<ApiErrorData>(error) && error.response) {
      throw new Error(
        error.response.data?.message || 'Password reset request failed',
      );
    }
    throw new Error('Network error or failed to connect');
  }
};

apiClient.interceptors.request.use(async config => {
  const token = useAuthStore.getState().token;
  const xtoken = useApiKeyStore.getState().key;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (xtoken) {
    config.headers['x-token'] = xtoken;
  }

  return config;
});

// Response interceptor untuk menangani token expired
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Jika error bukan 401 atau request sudah pernah di-retry, reject error
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      !error.response?.data?.session_token_expired
    ) {
      return Promise.reject(error);
    }

    // Jika sedang melakukan refresh token, tambahkan request ke queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({resolve, reject});
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const userSession = useAuthStore.getState().userSession;
      if (!userSession?.refresh_token) {
        throw new Error('No refresh token available');
      }

      const response = await refreshTokenApiCall({
        username: userSession.email,
        refresh_token: userSession.refresh_token,
      });

      // Update token di store
      useAuthStore.getState().setAuthState(response.session_token, {
        ...userSession,
        session_token: response.session_token,
      });

      // Update Authorization header
      originalRequest.headers.Authorization = `Bearer ${response.session_token}`;

      // Proses queue dengan token baru
      processQueue(null, response.session_token);

      // update local storage if needed
      useAuthStore.getState().updateLocalStorage();

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Logout user jika refresh token gagal
      useAuthStore.getState().clearAuthState();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
