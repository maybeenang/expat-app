import {create} from 'zustand';
import {RootStackParamList} from '../navigation/types';

interface RedirectState {
  targetScreen: keyof RootStackParamList | null;
  params?: any;
  setRedirect: (screen: keyof RootStackParamList, params?: any) => void;
  clearRedirect: () => void;
}

export const useRedirectStore = create<RedirectState>(set => ({
  targetScreen: null,
  params: undefined,
  setRedirect: (screen, params) => set({targetScreen: screen, params}),
  clearRedirect: () => set({targetScreen: null, params: undefined}),
}));
