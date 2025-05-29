import {create} from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AUTH_TOKEN_KEY, AUTH_SESSION_KEY} from '../constants/storage';
import type {LoginApiResponseData} from '../types/auth';
import {refreshTokenApiCall} from '../services/authService';

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
  setToken: (token: string | null) => void;
  setUserSession: (user: LoginApiResponseData | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(set => ({
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
  setToken: token => set({token, isLoggedIn: !!token}),
  setUserSession: async user => {
    set({userSession: user});
    if (user) {
      await EncryptedStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    }
  },
  logout: () => set({token: null, userSession: null, isLoggedIn: false}),
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
      const storedSession: LoginApiResponseData =
        JSON.parse(storedSessionString);

      const refreshedToken = await refreshTokenApiCall({
        username: storedSession.email,
        refresh_token: storedSession.refresh_token,
      });

      if (refreshedToken) {
        storedSession.session_token = refreshedToken.session_token;
        await EncryptedStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify(storedSession),
        );
        await EncryptedStorage.setItem(
          AUTH_TOKEN_KEY,
          refreshedToken.session_token,
        );
        setAuthState(storedToken, storedSession);
      } else {
        clearAuthState(); // Bersihkan state jika tidak ada token baru
      }
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
