"use client";
import dynamic from "next/dynamic";
import { GameUI } from "@/gameUI";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden flex">
      <div id="game-container" className="flex-grow h-full" />
      <GameUI />
      <GameRoot />
    </div>
  );
}
