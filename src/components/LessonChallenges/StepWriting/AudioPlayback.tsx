import { useCallback, useEffect } from "react";
import { useAudioPlayback } from "@/libs/audio/useAudioPlayback";
import { IconAudioWithCircle } from "../icons/IconAudioWithCircle";

export interface AudioPlaybackProps {
  audio: string | undefined;
  reproduceTargetAudioOnStart?: boolean;
  introductionFinished?: boolean;
}

export function AudioPlayback({
  audio,
  reproduceTargetAudioOnStart,
  introductionFinished,
}: AudioPlaybackProps) {
  const { play, isPlaying } = useAudioPlayback();

  const handleOnPlay = useCallback(async () => {
    if (!audio) return;
    play(audio);
  }, [audio, play]);

  useEffect(() => {
    if (introductionFinished && !!audio && reproduceTargetAudioOnStart) {
      play(audio);
    }
  }, [reproduceTargetAudioOnStart, audio, play, introductionFinished]);

  return (
    <>
      {audio && (
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={handleOnPlay}
            aria-label="Play word audio"
            className={[
              "h-10 w-10 rounded-full bg-black",
              "flex items-center justify-center",
              "transition-transform duration-150 ease-out",
              "hover:scale-105 active:scale-95 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#C20013]/70",
            ].join(" ")}
          >
            <IconAudioWithCircle
              isPlaying={isPlaying}
              circleColor="#111"
              iconColor="#fff"
            />
          </button>
        </div>
      )}
    </>
  );
}
