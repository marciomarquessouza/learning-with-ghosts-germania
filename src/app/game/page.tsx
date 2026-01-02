"use client";
import { DreamIntroduction } from "@/components/Introduction/DreamIntroduction";
import { Dialogue } from "@/components/Dialogues";
import RotateOverlay from "@/components/HomePage/RotateOverlay";
import { SceneIntroduction } from "@/components/Introduction/SceneIntroduction";
import dynamic from "next/dynamic";
import DreamLessonChallenges from "@/components/DreamLessonChallenges";
import { GameMessage } from "@/components/GameMessage";
import { LessonNotebook } from "@/components/DreamLessonChallenges/LessonNotebook";
import { TrainLessonChallenges } from "@/components/TrainLessonChallenges";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

export default function Game() {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden flex">
      <div id="game-container" className="flex-grow h-full" />
      <RotateOverlay />
      <SceneIntroduction />
      <DreamIntroduction />
      <GameMessage />
      <LessonNotebook />
      <DreamLessonChallenges />
      <TrainLessonChallenges />
      <Dialogue />
      <GameRoot />
    </div>
  );
}
