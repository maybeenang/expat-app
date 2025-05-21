import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {profileService} from '../services/profileService';
import {UpdateProfilePayload} from '../types/profile';
import {useAuthStore} from '../store/useAuthStore';
import {LoginApiResponseData} from '../types/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AUTH_SESSION_KEY} from '../constants/storage';
import axios from 'axios';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  const {setAuthState, token, userSession} = useAuthStore();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateProfile(payload),
    onSuccess: async (_, variable) => {
      try {
        queryClient.invalidateQueries({queryKey: ['profile']});

        // @ts-ignore
        const updatedUserSession: LoginApiResponseData = {
          ...userSession,
          nama: variable.full_name,
        };

        await EncryptedStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify(updatedUserSession),
        );

        setAuthState(token, updatedUserSession);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        console.error('Error updating profile: azio', error.response?.data);
      }
    },
  });
};

