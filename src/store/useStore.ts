import { create } from 'zustand';

interface AppState {
  count: number;
  setCount: (val: number) => void;
  // We'll update the component to handle the logic
}

export const useStore = create<AppState>((set) => ({
  count: 0,
  setCount: (val) => set({ count: val }),
}));