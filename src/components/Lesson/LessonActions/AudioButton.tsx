import { LessonStepType } from "@/types";
import { IconMic } from "@/components/Lesson/icons/IconMic";
import { IconAudio } from "@/components/Lesson/icons/IconAudio";

export interface AudioButtonProps {
  stepType: LessonStepType;
  isPlaying: boolean;
  onClick: () => void;
}

export function AudioButton({
  stepType,
  isPlaying,
  onClick,
}: AudioButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        stepType === "pronunciation" ? "Speak this word" : "Play word audio"
      }
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
      {stepType === "pronunciation" ? (
        <IconMic />
      ) : (
        <IconAudio active={isPlaying} />
      )}
    </button>
  );
}
