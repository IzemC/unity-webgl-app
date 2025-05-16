"use client";

import { useUnityStore } from "@/store/unity-store";
import { useCallback, useEffect, useRef, useState } from "react";

interface GameItemDescription {
  gameObjectName: string;
  methods: string[];
  hitPoint?: { x: number; y: number; z: number };
}

const methodDisplayOverrideMap: { [key: string]: string } = {
  SetPosition: "Move",
};

export const ObjectContextMenu = () => {
  const { gameInstance } = useUnityStore();
  const [currentItem, setCurrentItem] = useState<GameItemDescription | null>(
    null
  );
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [lastPointerPosition, setLastPointerPosition] = useState({
    x: 0,
    y: 0,
  });
  const pendingSetPositionItem = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      const { clientX, clientY } = e;
      console.log(e);
      if (!menuRef.current?.contains(e.target as Node)) {
        setLastPointerPosition({ x: clientX, y: clientY });
      }

      if (!currentItem) {
        setClickPosition({ x: clientX, y: clientY });
      }
    },
    [currentItem]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GameItemDescription") {
        try {
          const payload =
            typeof event.data.payload === "string"
              ? JSON.parse(event.data.payload)
              : event.data.payload;

          if (pendingSetPositionItem.current) {
            const coords = payload.hitPoint;
            if (coords) {
              gameInstance?.SendMessage(
                pendingSetPositionItem.current.gameObjectName,
                "SetPosition",
                `${coords.x},${coords.y},${coords.z}`
              );
            }
            pendingSetPositionItem.current = null;
            setCurrentItem(null);
            return;
          }

          const allowedMethods = ["Interact", "SetPosition", "Duplicate"];
          const hasValidMethods = payload.methods?.some((m: string) =>
            allowedMethods.includes(m)
          );

          if (hasValidMethods) {
            setClickPosition(lastPointerPosition);

            setCurrentItem({
              gameObjectName: payload.gameObjectName,
              methods: payload.methods.filter((m: string) =>
                allowedMethods.includes(m)
              ),
              hitPoint: payload.hitPoint,
            });
          }
        } catch (error) {
          console.error("Error parsing item data:", error);
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("message", handleMessage);
    };
  }, [gameInstance, currentItem, handlePointerDown, lastPointerPosition]);

  useEffect(() => {
    const handleCloseMenu = (e: MouseEvent | KeyboardEvent) => {
      if (
        e.type === "mousedown" &&
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setCurrentItem(null);
    };

    document.addEventListener("mousedown", handleCloseMenu);
    document.addEventListener("keydown", handleCloseMenu);

    return () => {
      document.removeEventListener("mousedown", handleCloseMenu);
      document.removeEventListener("keydown", handleCloseMenu);
    };
  }, []);

  const executeMethod = useCallback(
    (methodName: string) => {
      if (!currentItem) return;

      if (methodName === "SetPosition") {
        pendingSetPositionItem.current = currentItem;
      } else {
        gameInstance?.SendMessage(currentItem.gameObjectName, methodName);
      }
      setCurrentItem(null);
    },
    [gameInstance, currentItem]
  );

  if (!currentItem) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-800 rounded-md shadow-lg py-1 min-w-[100px]"
      style={{
        left: `${clickPosition.x}px`,
        top: `${clickPosition.y}px`,
        transform: "translate(10px, 10px)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {currentItem.methods.map((method) => (
        <button
          key={method}
          onClick={(e) => {
            e.stopPropagation();
            executeMethod(method);
          }}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors text-white`}
        >
          {methodDisplayOverrideMap[method] ?? method}
        </button>
      ))}
    </div>
  );
};
