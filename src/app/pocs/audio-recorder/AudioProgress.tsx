import { RecorderState } from "@/libs/audio/useAudioRecorder";
import { formatTime } from "@/utils/formatTime";
import { useEffect, useState } from "react";

export function AudioProgress({
  audioRecordRef,
  state,
}: {
  audioRecordRef: React.RefObject<HTMLAudioElement | null>;
  state: RecorderState;
}) {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRecordRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime || 0);
    const onLoaded = () => setDuration(el.duration || 0);
    const onEnded = () => setCurrent(0);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
    };
  }, [audioRecordRef]);

  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-xs text-[#bdbdbd]">
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full ${
            state === "playing"
              ? "animate-[pulse_1.6s_ease-in-out_infinite]"
              : ""
          }`}
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#C20013,#ff3b30)",
          }}
        />
      </div>
    </div>
  );
}
