"use client";

import { useUnityStore } from "@/store/unity-store";
import { useCallback, useEffect, useRef } from "react";

const ROTATION_ANGLE = 20;

export const useRotationControl = () => {
  const rotationDelta = useRef<[number, number]>([0, 0]);
  const keysPressed = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { gameInstance } = useUnityStore();

  const keyMap: Record<string, [number, number]> = {
    ArrowUp: [-ROTATION_ANGLE, 0],
    ArrowDown: [ROTATION_ANGLE, 0],
    ArrowLeft: [0, -ROTATION_ANGLE],
    ArrowRight: [0, ROTATION_ANGLE],
  };

  const updateRotation = () => {
    const rot: [number, number] = [0, 0];
    keysPressed.current.forEach((key) => {
      const delta = keyMap[key];
      if (delta) {
        rot[0] += delta[0];
        rot[1] += delta[1];
      }
    });
    rotationDelta.current = rot;
  };

  const rotate = (key: string, pressed: boolean) => {
    if (pressed) {
      keysPressed.current.add(key);
    } else {
      keysPressed.current.delete(key);
    }
    updateRotation();
  };

  const sendLoop = useCallback(() => {
    const [x, y] = rotationDelta.current;
    if (x !== 0) {
      gameInstance?.SendMessage("Main Camera", "RotateX", x);
    }
    if (y !== 0) {
      gameInstance?.SendMessage("Player", "RotateY", y);
    }
  }, [gameInstance]);

  useEffect(() => {
    intervalRef.current = setInterval(sendLoop, 100);
    return () => clearInterval(intervalRef.current!);
  }, [sendLoop]);

  return { rotate };
};
