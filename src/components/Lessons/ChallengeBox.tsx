import { Challenge } from "@/types";
import { IconAudio } from "./IconAudio";
import { IconMic } from "./IconMic";
import { useState } from "react";

type Mode = "audio" | "speak";

type ChallengeBoxProps = Challenge & {
  mode?: Mode;
  onPlay?: (word: string, mode: Mode) => void;
};

export function ChallengeBox({
  reference,
  challenge,
  phase,
  mode = "audio",
  onPlay,
}: ChallengeBoxProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOnPlay = () => {
    setIsPlaying((playing) => !playing);
    onPlay?.("", "audio");
  };

  if (phase === "hide") return null;

  const isLong = reference.length > 12 || challenge.length > 12;

  return (
    <div className="relative ml-8 my-4 w-[480px] grid grid-cols-2 shadow-2xl shadow-black">
      <div className="flex items-center justify-end bg-black pr-8 min-h-10 py-1">
        <p
          className={`font-primary text-[#FFF3E4] text-right leading-snug ${
            isLong ? "text-xl" : "text-2xl"
          }`}
        >
          {reference}
        </p>
      </div>

      <div className="flex items-center justify-start bg-[#C20013] pl-8 min-h-10 py-1">
        <p
          className={`font-primary text-[#FFF3E4] leading-snug ${
            isLong ? "text-xl" : "text-2xl"
          }`}
        >
          {challenge}
        </p>
      </div>

      <button
        type="button"
        onClick={handleOnPlay}
        aria-label={mode === "audio" ? "Play word audio" : "Speak this word"}
        className={[
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
          "h-10 w-10 rounded-full bg-white",
          "shadow-[0_6px_20px_rgba(0,0,0,0.45)] ring-1 ring-black/10",
          "flex items-center justify-center",
          "transition-transform duration-150 ease-out",
          "hover:scale-105 active:scale-95 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#C20013]/70",
        ].join(" ")}
      >
        {mode === "audio" ? <IconAudio active={isPlaying} /> : <IconMic />}
      </button>
    </div>
  );
}
