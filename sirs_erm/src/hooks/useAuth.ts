import {useMutation} from '@tanstack/react-query';
import {useAuthStore} from '../store/useAuthStore';
import {authService} from '../services/authService';

export const useAuth = () => {
  const {setUser, logout: logoutStore} = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: data => {
      setUser(data.user);
    },
    onError: error => {
      console.error('Login error:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: data => {
      setUser(data.user);
    },
    onError: error => {
      console.error('Registration error:', error);
    },
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logoutStore();
    }
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};

