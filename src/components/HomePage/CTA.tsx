"use client";
import { useGameProgressStore } from "@/store/progressStore";
import Link from "next/link";

export function HomeCTA() {
  const { snapshot } = useGameProgressStore();
  const getGamePath = () => {
    if (snapshot && snapshot.day && snapshot.scene) {
      return `/game/${snapshot.day}?scene=${snapshot.scene}`;
    }
    return `/game/1`;
  };

  return (
    <Link
      href={getGamePath()}
      aria-label="Start Learning With Ghosts — Germania"
      className={[
        "rounded-xl border-2 border-black bg-[#F3B162]",
        "px-10 py-4 font-primary text-xl font-bold tracking-wide text-black",
        "transition-transform active:translate-y-[2px] focus:outline-none",
        "focus-visible:ring-4 focus-visible:ring-black/30",
      ].join(" ")}
    >
      LEARN/PLAY
    </Link>
  );
}
