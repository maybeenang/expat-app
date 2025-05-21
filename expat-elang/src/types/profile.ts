export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

export interface ProfileResponse {
  status: number;
  message: string;
  data: Profile;
}

export interface UpdateProfilePayload {
  full_name: string;
  phone: string;
} 