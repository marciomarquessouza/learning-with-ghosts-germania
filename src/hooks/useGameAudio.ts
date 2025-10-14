import { Howl } from "howler";
import { useCallback, useState } from "react";

export function useGameAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const play = useCallback((audio?: string) => {
    if (!audio) return;
    const sound = new Howl({
      src: [audio],
      onend: () => setIsPlaying(false),
    });

    sound.play();
  }, []);

  return {
    play,
    isPlaying,
  };
}
