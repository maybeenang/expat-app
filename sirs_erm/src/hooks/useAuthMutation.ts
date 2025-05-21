import {useMutation} from '@tanstack/react-query';
import {authService} from '../services/authService';
import {useAuthStore} from '../store/useAuthStore';
import type {LoginCredentials} from '../types/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AUTH_SESSION_KEY, AUTH_TOKEN_KEY} from '../contants/storage';

export const useAuthMutations = () => {
  const {setAuthData} = useAuthStore();

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: async data => {
      setAuthData(data.data['x-token'], data.data.data_session);
      await EncryptedStorage.setItem(AUTH_TOKEN_KEY, data.data['x-token']);

      await EncryptedStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify(data.data.data_session),
      );
    },
  });

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      useAuthStore.getState().logout();
    },
  });

  return {
    login: login.mutateAsync,
    logout: logout.mutateAsync,
    isLoading: login.isPending || logout.isPending,
    error: login.error,
  };
};
