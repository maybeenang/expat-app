export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'admin' | 'user';
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginApiResponseData {
  'x-token': string;
  data_session: UserSession;
}

export interface UserSession {
  nama: string;
  rm_number: string;
  timezone: string;
  role: string;
  exp: number;
  duration: number;
  is_ranap: boolean;
  is_rajal: boolean;
  redirect: string;
  list_dept: DepartmentList;
}

export interface LoginApiResponse {
  status: number;
  message: string;
  data: LoginApiResponseData;
}

export interface ApiErrorData {
  status: number;
  message: string;
}

export interface Department {
  id_dept: number;
  nama_dept: string;
  prefix_dept_group: string;
}

export interface DepartmentList {
  rajal: Department[];
  ranap: Department[];
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    'x-token': string;
    data_session: UserSession;
  };
}

export interface ApiError {
  status: number;
  message: string;
}

