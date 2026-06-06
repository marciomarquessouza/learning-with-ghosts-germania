"use client";
import { useGameProgressStore } from "@/store/progressStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HomeCTA() {
  const { snapshot, clearSnapshot } = useGameProgressStore();
  const router = useRouter();
  const hasSavedProgress = snapshot && snapshot.day && snapshot.scene;

  const onNewGame = () => {
    clearSnapshot();
    router.push("/game/1");
  };

  if (!hasSavedProgress) {
    return (
      <Link
        href="/game/1"
        aria-label="Start Learning With Ghosts — Germania"
        className={[
          "rounded-xl border-2 border-black bg-[#F3B162]",
          "px-6 py-3 sm:px-10 sm:py-4",
          "font-primary text-base sm:text-xl font-bold tracking-wide text-black",
          "transition-transform active:translate-y-[2px] focus:outline-none",
          "focus-visible:ring-4 focus-visible:ring-black/30",
          "hover:bg-[#e8a54e] active:bg-[#d4943d]",
          "w-full sm:w-auto text-center",
        ].join(" ")}
      >
        LEARN/PLAY
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <button
        type="button"
        aria-label="Start New Game"
        onClick={onNewGame}
        className={[
          "rounded-xl border-2 border-[#F7EEDB] bg-[#111111]",
          "px-6 py-3 sm:px-10 sm:py-4",
          "font-primary text-base sm:text-xl font-bold tracking-wide text-[#F7EEDB]",
          "transition-transform active:translate-y-[2px] focus:outline-none",
          "focus-visible:ring-4 focus-visible:ring-[#F7EEDB]/40",
          "hover:bg-[#2A2A2A] active:bg-[#000000]",
          "shadow-[4px_4px_0px_#000000]",
          "w-full sm:w-auto text-center",
        ].join(" ")}
      >
        NEW GAME
      </button>

      <Link
        href={`/game/${snapshot.day}?scene=${snapshot.scene}`}
        aria-label="Continue Saved Game"
        className={[
          "rounded-xl border-2 border-black bg-[#F7EEDB]",
          "px-6 py-3 sm:px-10 sm:py-4",
          "font-primary text-base sm:text-xl font-bold tracking-wide text-black",
          "transition-transform active:translate-y-[2px] focus:outline-none",
          "focus-visible:ring-4 focus-visible:ring-[#F7EEDB]/40",
          "hover:bg-[#E8D7B8] active:bg-[#D8C49D]",
          "shadow-[4px_4px_0px_#000000]",
          "w-full sm:w-auto text-center",
        ].join(" ")}
      >
        CONTINUE
      </Link>
    </div>
  );
}
