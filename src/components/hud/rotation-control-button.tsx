"use client";

import { cn } from "@/utils/cn";

interface RotationControlButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  dirKey: string;
  rotate: (key: string, pressed: boolean) => void;
}

export const RotationControlButton: React.FC<RotationControlButtonProps> = ({
  label,
  className,
  dirKey,
  rotate,
  ...props
}) => {
  return (
    <button
      onPointerDown={() => rotate(dirKey, true)}
      onPointerUp={() => rotate(dirKey, false)}
      onPointerLeave={() => rotate(dirKey, false)}
      className={cn(
        "size-8 md:size-16 focus-visible:outline-none rounded-full bg-gray-800/80 flex items-center justify-center pointer-events-auto",
        className
      )}
      {...props}
    >
      {label}
    </button>
  );
};
