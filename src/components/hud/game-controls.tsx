"use client";

import { useEffect } from "react";
import { useMovementControl } from "@/hooks/use-movement-control";
import { RotationControlButton } from "@/components/hud/rotation-control-button";
import { MoveControlButton } from "@/components/hud/move-control-button";
import { useRotationControl } from "@/hooks/use-rotation-control";

export const GameControls = () => {
  const { move } = useMovementControl();
  const { rotate } = useRotationControl();

  // Keyboard handlerss
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      move(e.key, true);
      rotate(e.key, true);
    };
    const up = (e: KeyboardEvent) => {
      move(e.key, false);
      rotate(e.key, false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [move, rotate]);

  return (
    <div className="pointer-events-none w-full h-full p-2 sm:p-4">
      <div className="flex justify-between items-end w-full">
        {/* Movement Controls */}
        <div className="pointer-events-auto">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <MoveControlButton label="W" dirKey="w" move={move} />
            <div />
            <MoveControlButton label="A" dirKey="a" move={move} />
            <MoveControlButton label="S" dirKey="s" move={move} />
            <MoveControlButton label="D" dirKey="d" move={move} />
          </div>
        </div>
        <div className="flex items-end gap-4 sm:gap-10">
          {/* Jump Button */}
          <div className="pointer-events-auto">
            <MoveControlButton
              label={
                <div className="flex flex-col items-center justify-center">
                  <div>Jump</div>
                  <div className="hidden sm:block text-xs">Space</div>
                </div>
              }
              dirKey=" "
              move={move}
              className="size-10 bg-green-500/80"
            />
          </div>
          {/* Rotation Controls */}
          <div className="pointer-events-auto flex flex-col items-center">
            <RotationControlButton
              dirKey="ArrowUp"
              rotate={rotate}
              label={"↑"}
              className="-mb-2 md:-mb-4"
            />
            <div className="flex gap-12">
              <RotationControlButton
                dirKey="ArrowLeft"
                label="←"
                rotate={rotate}
              />
              <RotationControlButton
                dirKey="ArrowRight"
                label="→"
                rotate={rotate}
              />
            </div>
            <RotationControlButton
              dirKey="ArrowDown"
              rotate={rotate}
              label={"↓"}
              className="-mt-2 md:-mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
