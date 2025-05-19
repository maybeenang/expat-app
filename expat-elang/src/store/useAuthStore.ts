import {create} from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AUTH_TOKEN_KEY, AUTH_SESSION_KEY} from '../constants/storage';
import type {LoginApiResponseData, UserSession} from '../types/auth';

interface AuthState {
  token: string | null;
  userSession: LoginApiResponseData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setAuthState: (
    token: string | null,
    session: LoginApiResponseData | null,
  ) => void;
  clearAuthState: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  userSession: null,
  isLoggedIn: false,
  isLoading: true,
  setAuthState: (token, session) =>
    set({
      token: token,
      userSession: session,
      isLoggedIn: !!token,
      isLoading: false,
    }),
  clearAuthState: () =>
    set({
      token: null,
      userSession: null,
      isLoggedIn: false,
      isLoading: false,
    }),
  setLoading: loading => set({isLoading: loading}),
}));

export const checkAuthStatus = async () => {
  const {setAuthState, setLoading, clearAuthState} = useAuthStore.getState();
  setLoading(true);
  try {
    const storedToken = await EncryptedStorage.getItem(AUTH_TOKEN_KEY);
    const storedSessionString = await EncryptedStorage.getItem(
      AUTH_SESSION_KEY,
    );

    if (storedToken && storedSessionString) {
      const storedSession: UserSession = JSON.parse(storedSessionString);

      const nowInSeconds = Math.floor(Date.now() / 1000);
      const isExpired = storedSession.exp && storedSession.exp < nowInSeconds;
      if (isExpired) {
        console.warn('Session expired. Clearing auth state.');
        clearAuthState();
        return;
      }

      setAuthState(storedToken, storedSession);
    } else {
      clearAuthState(); // Pastikan state bersih jika tidak ada data valid
    }
  } catch (error) {
    console.error('Failed to load auth status:', error);
    clearAuthState(); // Bersihkan state jika ada error baca storage
  } finally {
    setLoading(false);
  }
};
