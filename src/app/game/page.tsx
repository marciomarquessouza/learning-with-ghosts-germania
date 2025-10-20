"use client";
import { DreamIntroduction } from "@/components/Introduction/DreamIntroduction";
import { Dialogue } from "@/components/Dialogues";
import RotateOverlay from "@/components/HomePage/RotateOverlay";
import { SceneIntroduction } from "@/components/Introduction/SceneIntroduction";
import dynamic from "next/dynamic";
import Lesson from "@/components/Lesson";
import { GameMessage } from "@/components/GameMessage";
import { LessonNotebook } from "@/components/Lesson/LessonNotebook";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden">
      <RotateOverlay />
      <SceneIntroduction />
      <DreamIntroduction />
      <GameMessage />
      <LessonNotebook />
      <Lesson />
      <Dialogue />
      <GameRoot />
      <div id="game-container" className="w-full h-full"></div>
    </div>
  );
}
