"use client";
import { DreamIntroduction } from "@/components/Introduction/DreamIntroduction";
import { Dialogue } from "@/components/Dialogues";
import RotateOverlay from "@/components/HomePage/RotateOverlay";
import { SceneIntroduction } from "@/components/Introduction/SceneIntroduction";
import dynamic from "next/dynamic";
import { LessonIntroduction } from "@/components/Introduction/LessonIntroduction";
import { Notebook } from "@/components/Notebook";
import { LessonDialog } from "@/components/Lessons";
import { GameMessage } from "@/components/GameMessage";

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
      <LessonDialog />
      <Dialogue />
      <GameRoot />
      <div id="game-container" className="w-full h-full"></div>
    </div>
  );
}
