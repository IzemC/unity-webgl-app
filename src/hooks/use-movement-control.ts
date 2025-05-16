"use client";

import { useUnityStore } from "@/store/unity-store";
import { useCallback, useEffect, useRef } from "react";

const MOVEMENT_DURATION = 1;
const MAX_MULTIPLIER = 30;
const MIN_MULTIPLIER = 3;
const CHARGE_INCREMENT = 1;
const LOOP_INTERVAL = 100;

export const useMovementControl = () => {
  const direction = useRef<[number, number, number]>([0, 0, 0]);
  const keysPressed = useRef<Set<string>>(new Set());
  const chargeMultiplier = useRef<number>(MIN_MULTIPLIER);
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
    " ": [0, 1, 0],
    e: [0, 0, 0],
  };

  const move = (key: string, pressed: boolean) => {
    if (pressed) {
      keysPressed.current.add(key);
    } else {
      keysPressed.current.delete(key);
    }

    if (key === "e" && !pressed) {
      chargeMultiplier.current = MIN_MULTIPLIER;
    }

    updateDirection();
  };

  const sendLoop = useCallback(() => {
    const [x, y, z] = direction.current;
    const isCharging = keysPressed.current.has("e");

    if (isCharging && chargeMultiplier.current < MAX_MULTIPLIER) {
      chargeMultiplier.current = Math.min(
        chargeMultiplier.current + CHARGE_INCREMENT,
        MAX_MULTIPLIER
      );
    }

    const chargedX = x * chargeMultiplier.current;
    const chargedZ = z * chargeMultiplier.current;
    const mag = Math.abs(chargedX) + Math.abs(y) + Math.abs(chargedZ);

    gameInstance?.SendMessage(
      "Player",
      "Move",
      mag
        ? [chargedX, y, chargedZ, MOVEMENT_DURATION].join(",")
        : [0, 0, 0, 0].join(",")
    );
  }, [gameInstance]);

  useEffect(() => {
    intervalRef.current = setInterval(sendLoop, LOOP_INTERVAL);
    return () => clearInterval(intervalRef.current!);
  }, [sendLoop]);

  return { move };
};
