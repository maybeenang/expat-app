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

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}
