"use client";

import { Howl } from "howler";
import { useCallback, useRef, useState } from "react";

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  const play = useCallback((audio: string) => {
    howlRef.current = new Howl({
      src: [audio],
      onend: () => setIsPlaying(false),
    });

    howlRef.current.play();
  }, []);

  const stop = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      setIsPlaying(false);
    }
  }, []);

  return {
    play,
    stop,
    isPlaying,
  };
}
