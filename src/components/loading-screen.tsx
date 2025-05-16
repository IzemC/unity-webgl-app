"use client";

import { useUnityStore } from "@/store/unity-store";

export const LoadingScreen = () => {
  const { loading, progress } = useUnityStore();

  return (
    loading && (
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
        <p className="text-white text-xl font-medium">
          Loading... {Math.round(progress * 100)}%
        </p>
      </div>
    )
  );
};
