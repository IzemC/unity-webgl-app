import { cn } from "@/utils/cn";
import React from "react";

interface MoveControlButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  dirKey: string;
  move: (key: string, pressed: boolean) => void;
}

export const MoveControlButton: React.FC<MoveControlButtonProps> = ({
  label,
  dirKey,
  move,
  className,
  ...props
}) => {
  return (
    <button
      onPointerDown={() => move(dirKey, true)}
      onPointerUp={() => move(dirKey, false)}
      onPointerLeave={() => move(dirKey, false)}
      className={cn(
        "size-8 md:size-16 focus-visible:outline-none rounded-full bg-gray-800/80 text-white text-sm md:text-xl flex items-center justify-center pointer-events-auto select-none",
        className
      )}
      {...props}
    >
      {label}
    </button>
  );
};
