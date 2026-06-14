"use client";
import { useEffect, useRef, useState } from "react";
import { WaveText } from "../WaveText";
import { ProgressBar } from "../ProgressBar";
import { FloatingGhost } from "../FloatingGhost";

interface GhostLoadingProps {
  text?: string;
}

export function GhostLoading({ text = "Loooaaading...." }: GhostLoadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 300;

  useEffect(() => {
    if (!ref.current) return;

    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        setVisible(false);
      }
    });

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-black text-white flex flex-col justify-center items-center z-[9999]"
    >
      <FloatingGhost />
      <div className="mt-4">
        <ProgressBar />
      </div>

      <div className="my-4">
        <div className="font-primary font-medium text-2xl text-white">
          <WaveText text={text} />
        </div>
      </div>
    </div>
  );
}
