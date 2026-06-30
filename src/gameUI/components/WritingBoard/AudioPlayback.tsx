import { useState } from "react";
import { IconAudioWithCircle } from "../LessonChallenges/icons/IconAudioWithCircle";
import { events } from "@/events/events";

export interface AudioPlaybackProps {
  target: string;
}

export function AudioPlayback({ target }: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOnPlay = () => {
    events.audio.sync.emit("audio:play-sample", {
      audioKey: target,
    });
  };

  return (
    <>
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
    </>
  );
}
