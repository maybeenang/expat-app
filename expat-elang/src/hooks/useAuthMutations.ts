import {useMutation, useQueryClient} from '@tanstack/react-query';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuthStore} from '../store/useAuthStore';
import {loginApiCall} from '../services/authService';
import {AUTH_TOKEN_KEY, AUTH_SESSION_KEY} from '../constants/storage';
import type {LoginCredentials, LoginApiResponseData} from '../types/auth';
import {useShallow} from 'zustand/react/shallow';
import {queryKeys} from '../services/queryKeys';

export const useAuthMutations = () => {
  const {setAuthState, clearAuthState} = useAuthStore(
    useShallow(state => {
      return {
        setAuthState: state.setAuthState,
        clearAuthState: state.clearAuthState,
      };
    }),
  );

  const queryClient = useQueryClient();

  const loginMutation = useMutation<
    LoginApiResponseData,
    Error,
    LoginCredentials
  >({
    mutationFn: loginApiCall,
    onSuccess: async data => {
      const {session_token: token} = data;

      try {
        await EncryptedStorage.setItem(AUTH_TOKEN_KEY, token);
        await EncryptedStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(data));
        setAuthState(token, data); // Update Zustand store

        // Refetch all data after successful login
        await Promise.all([
          // Jobs
          queryClient.invalidateQueries({
            queryKey: queryKeys.jobKeys.all,
          }),
          // Events
          queryClient.invalidateQueries({
            queryKey: queryKeys.eventKeys.all,
          }),
          // Blog
          queryClient.invalidateQueries({
            queryKey: queryKeys.blogKeys.all,
          }),
          // Forum
          queryClient.invalidateQueries({
            queryKey: queryKeys.forumKeys.all,
          }),
          // Biz
          queryClient.invalidateQueries({
            queryKey: queryKeys.bizKeys.all,
          }),
          // Rental
          queryClient.invalidateQueries({
            queryKey: queryKeys.rentalKeys.all,
          }),
        ]);
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
    login: loginMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending, // Status loading dari mutation
    error: loginMutation.error,
  };
};
