import {PROFILE_ENDPOINT} from '../constants/api';
import {ProfileResponse, UpdateProfilePayload} from '../types/profile';
import apiClient from './authService';

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(PROFILE_ENDPOINT);
    return response.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ProfileResponse> => {
    const formData = new FormData();
    formData.append('full_name', payload.full_name);
    formData.append('phone', payload.phone);

    const response = await apiClient.post<ProfileResponse>(
      PROFILE_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
};

