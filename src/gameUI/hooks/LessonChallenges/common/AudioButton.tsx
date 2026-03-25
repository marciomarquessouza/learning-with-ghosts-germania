import { useMemo } from "react";
import { IconMicWithCircle } from "../icons/IconMicWithCircle";
import { IconAudioWithCircle } from "../icons/IconAudioWithCircle";
import { IconReproduceWithCircle } from "../icons/IconReproduceWithCircle";

export type AudioButtonTypes = "reference" | "record" | "reproduce";

export interface AudioButtonProps {
  type: AudioButtonTypes;
  isPlaying?: boolean;
  isRecording?: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

export function AudioButton({
  type,
  isPlaying = false,
  isRecording = false,
  isLoading = false,
  onClick,
}: AudioButtonProps) {
  const ariaLabel = useMemo(() => {
    switch (type) {
      case "record":
        return "Speak this word";
      case "reference":
        return "Play word audio";
      case "reproduce":
        return "Reproduce your audio";
    }
  }, [type]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
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
      {type === "record" && (
        <IconMicWithCircle isRecording={isRecording} isLoading={isLoading} />
      )}
      {type === "reference" && <IconAudioWithCircle isPlaying={isPlaying} />}
      {type === "reproduce" && (
        <IconReproduceWithCircle isPlaying={isPlaying} />
      )}
    </button>
  );
}
