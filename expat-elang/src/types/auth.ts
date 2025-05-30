export interface UserSession {
  id: string;
  nama: string;
  email: string;
  timezone: string;
  role: string;
  exp: number;
  duration: number;
  is_ranap: boolean;
  is_rajal: boolean;
  redirect: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  full_name: string;
  mobile_phone: string;
  email: string;
  password: string;
}

export interface RegisterApiResponseData {
  user_id: number;
  full_name: string;
  email: string;
}

export interface RegisterApiResponse {
  status: string;
  message: string;
  data: RegisterApiResponseData;
  csrf_token_hash: null;
}

export interface RefreshTokenCredentials {
  username: string;
  refresh_token: string;
}

export interface LoginApiResponseData {
  id: string;
  nama: string;
  email: string;
  timezone: string;
  role: string;
  exp: number;
  duration: number;
  redirect: string;
  session_token: string;
  refresh_token: string;
}

export interface LoginApiResponse {
  status: number;
  message: string;
  data: LoginApiResponseData;
}

export interface RefreshTokenApiResponse {
  status: number;
  message: string;
  data: {
    session_token: string;
  };
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ForgotPasswordApiResponse {
  status: number;
  message: string;
}

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}
