import {create} from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import type {User, UserSession} from '../types/auth';
import {AUTH_SESSION_KEY, AUTH_TOKEN_KEY} from '../contants/storage';

interface AuthState {
  token: string | null;
  userSession: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthData: (token: string, session: UserSession) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  userSession: null,
  isAuthenticated: false,
  isLoading: false,
  setAuthData: (token, session) =>
    set({
      token,
      userSession: session,
      isAuthenticated: true,
    }),
  setLoading: loading => set({isLoading: loading}),
  logout: async () => {
    try {
      await EncryptedStorage.removeItem(AUTH_TOKEN_KEY);
      await EncryptedStorage.removeItem(AUTH_SESSION_KEY);
      await EncryptedStorage.clear();

      set({
        token: null,
        userSession: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
      set({
        token: null,
        userSession: null,
        isAuthenticated: false,
      });
    }
  },
}));

export const checkAuthStatus = async () => {
  const {setAuthData, setLoading, logout} = useAuthStore.getState();
  setLoading(true);
  try {
    const storedToken = await EncryptedStorage.getItem(AUTH_TOKEN_KEY);
    const storedSessionString =
      await EncryptedStorage.getItem(AUTH_SESSION_KEY);

    if (storedToken && storedSessionString) {
      const storedSession: UserSession = JSON.parse(storedSessionString);

      const nowInSeconds = Math.floor(Date.now() / 1000);
      const isExpired = storedSession.exp && storedSession.exp < nowInSeconds;
      if (isExpired) {
        console.warn('Session expired. Clearing auth state.');
        logout();
        return;
      }

      setAuthData(storedToken, storedSession);
    } else {
      logout();
    }
  } catch (error) {
    console.error('Failed to load auth status:', error);
    logout();
  } finally {
    setLoading(false);
  }
};
