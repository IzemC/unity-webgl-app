"use client";

import { useUnityStore } from "@/store/unity-store";
import { useCallback, useEffect, useRef } from "react";

const MOVEMENT_DURATION = 1;

export const useMovementControl = () => {
  const direction = useRef<[number, number, number]>([0, 0, 0]);
  const keysPressed = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { gameInstance } = useUnityStore();

  const updateDirection = () => {
    const dirs: [number, number, number] = [0, 0, 0];
    keysPressed.current.forEach((key) => {
      const move = keyMap[key];
      if (move) {
        dirs[0] += move[0];
        dirs[1] += move[1];
        dirs[2] += move[2];
      }
    });
    direction.current = dirs;
  };

  const keyMap: Record<string, [number, number, number]> = {
    w: [0, 0, 1],
    s: [0, 0, -1],
    a: [-1, 0, 0],
    d: [1, 0, 0],
    " ": [0, 0.1, 0],
  };

  const move = (key: string, pressed: boolean) => {
    if (pressed) {
      keysPressed.current.add(key);
    } else {
      keysPressed.current.delete(key);
    }
    updateDirection();
  };

  const sendLoop = useCallback(() => {
    const [x, y, z] = direction.current;
    const mag = Math.abs(x) + Math.abs(y) + Math.abs(z);
    if (!mag) return;
    gameInstance?.SendMessage(
      "Player",
      "Move",
      mag ? [x, y, z, MOVEMENT_DURATION].join(",") : [0, 0, 0, 0].join(",")
    );
  }, [gameInstance]);

  useEffect(() => {
    intervalRef.current = setInterval(sendLoop, 100);
    return () => clearInterval(intervalRef.current!);
  }, [sendLoop]);

  return { move };
};
