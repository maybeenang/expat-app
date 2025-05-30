import EncryptedStorage from 'react-native-encrypted-storage';
import {create} from 'zustand';
import {ENV} from '../config/env';
import {loginApiCall} from '../services/authService';

interface ApiKeyState {
  key: string | null;
  username: string;
  password: string;
  isLoadingKey: boolean;
  setLoadingKey: (loading: boolean) => void;
  setApiKey: (key: string | null) => void;
  setUsername: (email: string) => void;
  setPassword: (password: string) => void;
  clearApiKey: () => void;
  setStorage: () => Promise<void>;
}

export const useApiKeyStore = create<ApiKeyState>()(set => ({
  key: null,
  isLoadingKey: false,
  username: ENV.API_KEY_USERNAME || '',
  password: ENV.API_KEY_PASSWORD || '',

  setLoadingKey: (loading: boolean) => set({isLoadingKey: loading}),

  setApiKey: (key: string | null) => set({key}),

  setUsername: (username: string) => set({username}),

  setPassword: (password: string) => set({password}),

  clearApiKey: () => set({key: null, username: '', password: ''}),

  setStorage: async () => {
    const {key, username, password} = useApiKeyStore.getState();
    if (key) {
      await EncryptedStorage.setItem('API_KEY', key);
    } else {
      await EncryptedStorage.removeItem('API_KEY');
    }
    await EncryptedStorage.setItem('API_KEY_USERNAME', username);
    await EncryptedStorage.setItem('API_KEY_PASSWORD', password);
  },
}));

export const getApiKey = async (): Promise<string | null> => {
  const {username, password, setStorage, setApiKey, setLoadingKey} =
    useApiKeyStore.getState();

  setLoadingKey(true);

  if (!username || !password) {
    return null;
  }
  try {
    const creds = await loginApiCall({username, password});

    if (creds && creds.session_token) {
      setApiKey(creds.session_token);
      await setStorage();
      console.log('API key retrieved successfully');
      return creds.session_token;
    } else {
      setApiKey(null);
      return null;
    }
  } catch (error) {
    console.error('Failed to get API key:', error);
    setApiKey(null);
    return null;
  } finally {
    setLoadingKey(false);
  }
};
