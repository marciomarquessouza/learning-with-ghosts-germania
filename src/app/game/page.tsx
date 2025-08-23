"use client";
import { DreamIntroduction } from "@/components/DreamIntroduction";
import { InteractionBox } from "@/components/InteractionDialogue/InteractionBox";
import { MessageBox } from "@/components/MessageBox";
import RotateOverlay from "@/components/RotateOverlay";
import { SceneIntroduction } from "@/components/SceneIntroduction";
import dynamic from "next/dynamic";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden">
      <RotateOverlay />
      <SceneIntroduction />
      <DreamIntroduction />
      <MessageBox />
      <InteractionBox />
      <GameRoot />
      <div id="game-container" className="w-full h-full"></div>
    </div>
  );
}
