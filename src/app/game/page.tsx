"use client";
import { DreamIntroduction } from "@/components/DreamIntroduction";
import { Dialogue } from "@/components/Dialogues";
import { GameMessage } from "@/components/GameMessage";
import RotateOverlay from "@/components/RotateOverlay";
import { SceneIntroduction } from "@/components/SceneIntroduction";
import dynamic from "next/dynamic";
import { LessonIntroduction } from "@/components/LessonIntroduction";
import { Notebook } from "@/components/Notebook";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden">
      <RotateOverlay />
      <Notebook />
      <SceneIntroduction />
      <DreamIntroduction />
      <LessonIntroduction />
      <GameMessage />
      <Dialogue />
      <GameRoot />
      <div id="game-container" className="w-full h-full"></div>
    </div>
  );
}
