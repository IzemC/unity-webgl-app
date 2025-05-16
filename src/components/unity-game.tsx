"use client";

import React, { useEffect, useRef } from "react";
import { useUnityStore } from "@/store/unity-store";

declare global {
  interface Window {
    createUnityInstance?: any;
  }
}

export const UnityGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { loading, onProgress, setLoading, setGameInstance } = useUnityStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const loadUnityGame = async () => {
      const buildUrl = "/unity-build";
      const config = {
        dataUrl: `${buildUrl}/WebGL.data.gz`,
        frameworkUrl: `${buildUrl}/WebGL.framework.js.gz`,
        codeUrl: `${buildUrl}/WebGL.wasm.gz`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "HoloFair",
        productName: "WebGL Game",
        productVersion: "1.0",
      };

      const script = document.createElement("script");
      script.src = `${buildUrl}/WebGL.loader.js`;
      script.async = true;
      script.onload = () => {
        if (window.createUnityInstance) {
          window
            .createUnityInstance(
              canvasRef.current!,
              config,
              (progress: number) => {
                onProgress(progress);
              }
            )
            .then((instance: any) => {
              setGameInstance(instance);
              // instance.SendMessage("Player", "SetInput", "True");
            })
            .catch((error: Error) => {
              console.error("Unity initialization failed:", error);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadUnityGame();
  }, [onProgress, setLoading, setGameInstance]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        id="unity-canvas"
        className="w-full h-full"
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};
