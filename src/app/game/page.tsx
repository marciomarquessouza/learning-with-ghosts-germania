"use client";
import dynamic from "next/dynamic";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div
      className="bg-black text-white w-screen h-screen overflow-hidden"
      id="game-container"
    >
      <GameRoot />
    </div>
  );
}
