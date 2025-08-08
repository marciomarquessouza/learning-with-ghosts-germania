"use client";
import { MessageBox } from "@/components/MessageBox";
import RotateOverlay from "@/components/RotateOverlay";
import dynamic from "next/dynamic";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden">
      <RotateOverlay />
      <MessageBox />
      <GameRoot />
      <div id="game-container" className="w-full h-full"></div>
    </div>
  );
}
