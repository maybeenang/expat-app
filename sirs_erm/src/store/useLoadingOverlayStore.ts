import {create} from 'zustand';

interface LoadingOverlayState {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
}

export const useLoadingOverlayStore = create<LoadingOverlayState>(set => ({
  isVisible: false,
  show: () => set({isVisible: true}),
  hide: () => set({isVisible: false}),
}));

