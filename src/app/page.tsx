import { UnityGame } from "@/components/unity-game";
import { LoadingScreen } from "@/components/loading-screen";
import type { Metadata } from "next";

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
        </div>
      </main>
    </>
  );
}
