import { UnityGame } from "@/components/unity-game";
import { LoadingScreen } from "@/components/loading-screen";
import { GameControls } from "@/components/hud/game-controls";
import { HUDWrapper } from "@/components/hud/hud-wrapper";
import type { Metadata } from "next";
import { ObjectContextMenu } from "@/components/hud/object-context-menu";

export const metadata: Metadata = {
  title: "Unity WebGL Game",
  description: "Unity WebGL game",
};

export default function Home() {
  return (
    <>
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Unity WebGL Game
        </h1>

        <div className="relative aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
          <UnityGame />
          <LoadingScreen />
          <ObjectContextMenu />
          <HUDWrapper className="absolute pointer-events-none z-10 bottom-0 left-0 w-full">
            <GameControls />
          </HUDWrapper>
        </div>
      </main>
    </>
  );
}
