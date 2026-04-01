import { useEffect, useState } from "react";
import { PromptStates } from "../GameActionPrompt.boundary";

export interface TimerProps {
  state: PromptStates;
  duration?: number;
  onFinish: () => void;
}

const DEFAULT_TIME = 30;

export function Timer({
  state,
  duration = DEFAULT_TIME,
  onFinish,
}: TimerProps) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (state === "hidden") {
      setTime(duration);
      return;
    }

    setTime(duration);
  }, [state, duration]);

  useEffect(() => {
    if (state === "hidden") return;

    if (time <= 0) {
      onFinish();
      return;
    }

    const timeout = window.setTimeout(() => {
      setTime((currentTime) => Math.max(0, currentTime - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [state, time, onFinish]);

  const progress = duration > 0 ? time / duration : 0;

  return (
    <div className="relative h-10 w-10 bg-red-600">
      <div
        className="h-full bg-black transition-all duration-200"
        style={{ width: `${progress * 100}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-center font-mono text-base font-bold tracking-wide text-white">
          {time}
        </p>
      </div>
    </div>
  );
}
