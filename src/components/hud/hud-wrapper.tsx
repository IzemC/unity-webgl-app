"use client";

import { useUnityStore } from "@/store/unity-store";

export const HUDWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const { loading, gameInstance } = useUnityStore();

  return !loading && gameInstance && <div {...props}>{children}</div>;
};
