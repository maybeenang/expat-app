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
  email: string;
  password: string;
}

export interface LoginApiResponseData {
  'x-token': string;
  data_session: UserSession;
}

export interface LoginApiResponse {
  status: number;
  message: string;
  data: LoginApiResponseData;
}

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}
