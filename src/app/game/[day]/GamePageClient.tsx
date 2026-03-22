"use client";
import dynamic from "next/dynamic";
import { GameUI } from "@/gameUI";
import { DayContent } from "@/types";

const GameRoot = dynamic(() => import("@/game/main"), {
  ssr: false,
});

interface Props {
  day: number;
  dayContent: DayContent;
}

export function GamePageClient({ day, dayContent }: Props) {
  return (
    <div className="bg-black text-white w-screen h-screen overflow-hidden flex">
      <div id="game-container" className="flex-grow h-full" />
      <GameUI />
      <GameRoot day={day} dayContent={dayContent} />
    </div>
  );
}
