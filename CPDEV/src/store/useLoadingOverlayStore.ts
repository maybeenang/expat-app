import {create} from 'zustand';

interface LoadingState {
  counter: number;
  isLoading: boolean;
  show: () => void;
  hide: () => void;
  reset: () => void;
}

export const useLoadingOverlayStore = create<LoadingState>()((set, get) => ({
  counter: 0,
  isLoading: false,

  show: () => {
    const current = get().counter + 1;
    set({counter: current, isLoading: true}, false);
  },

  hide: () => {
    const current = get().counter - 1;
    const clamped = Math.max(0, current);
    set({counter: clamped, isLoading: clamped > 0}, false);
  },

  reset: () => set({counter: 0, isLoading: false}, false),
}));
