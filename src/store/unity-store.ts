import { create } from "zustand";

interface UnityState {
  loading: boolean;
  progress: number;
  gameInstance: any;
  setLoading: (loading: boolean) => void;
  setGameInstance: (instance: any) => void;
  onProgress: (progress: any) => void;
}

export const useUnityStore = create<UnityState>((set) => ({
  loading: true,
  progress: 0,
  gameInstance: null,
  setLoading: (loading) => set({ loading }),
  setGameInstance: (instance) => set({ gameInstance: instance }),
  onProgress: (progress) => set({ progress }),
}));
