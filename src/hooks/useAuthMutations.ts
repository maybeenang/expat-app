import {useMutation} from '@tanstack/react-query';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuthStore} from '../store/useAuthStore';
import {loginApiCall} from '../services/authService';
import {AUTH_TOKEN_KEY, AUTH_SESSION_KEY} from '../constants/storage';
import type {LoginCredentials, LoginApiResponseData} from '../types/auth';
import {useShallow} from 'zustand/react/shallow';

export const useAuthMutations = () => {
  const {setAuthState, clearAuthState} = useAuthStore(
    useShallow(state => {
      return {
        setAuthState: state.setAuthState,
        clearAuthState: state.clearAuthState,
      };
    }),
  );

  const loginMutation = useMutation<
    LoginApiResponseData,
    Error,
    LoginCredentials
  >({
    mutationFn: loginApiCall,
    onSuccess: async data => {
      const {'x-token': token, data_session: sessionData} = data;
      try {
        await EncryptedStorage.setItem(AUTH_TOKEN_KEY, token);
        await EncryptedStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify(sessionData),
        );
        setAuthState(token, sessionData); // Update Zustand store
      } catch (storageError) {
        console.error('Storage Error on Login:', storageError);
        clearAuthState();
      }
    },
    onError: error => {
      console.error('Login Mutation Error:', error.message);
      clearAuthState();
    },
  });

  // --- Logout Function ---
  const logout = async () => {
    try {
      await EncryptedStorage.removeItem(AUTH_TOKEN_KEY);
      await EncryptedStorage.removeItem(AUTH_SESSION_KEY);
    } catch (error) {
      console.error('Storage Error on Logout:', error);
    } finally {
      clearAuthState();
      loginMutation.reset();
      // TODO: Panggil API logout jika ada
    }
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending, // Status loading dari mutation
    error: loginMutation.error,
  };
};
