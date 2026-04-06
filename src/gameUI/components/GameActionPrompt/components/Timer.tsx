import { useEffect, useState } from "react";
import { PromptStates } from "../GameActionPrompt.boundary";

export interface TimerProps {
  state: PromptStates;
  durationMs?: number;
  onFinish: () => void;
}

const DEFAULT_TIME = 30_000;

export function Timer({
  state,
  durationMs = DEFAULT_TIME,
  onFinish,
}: TimerProps) {
  const [timeMs, setTimeMs] = useState(durationMs);

  useEffect(() => {
    if (state === "hidden") {
      setTimeMs(durationMs);
      return;
    }

    setTimeMs(durationMs);
  }, [state, durationMs]);

  useEffect(() => {
    if (state === "hidden") return;

    if (timeMs <= 0) {
      onFinish();
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeMs((current) => Math.max(0, current - 100));
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [state, timeMs, onFinish]);

  const progress = durationMs > 0 ? timeMs / durationMs : 0;

  const seconds = Math.ceil(timeMs / 1000);

  return (
    <div className="relative h-10 w-10 bg-red-600">
      <div
        className="h-full bg-black transition-all duration-200"
        style={{ width: `${progress * 100}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-center font-mono text-base font-bold tracking-wide text-white">
          {seconds}
        </p>
      </div>
    </div>
  );
}
