"use client";

import { Howl } from "howler";
import { useCallback, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export function useGameAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef<Howl | null>(null);
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    error: recordingError,
  } = useReactMediaRecorder({
    blobPropertyBag: { type: "audio/webm" },
    audio: true,
    video: false,
  });

  const play = useCallback((audio: string) => {
    howlRef.current = new Howl({
      src: [audio],
      onend: () => setIsPlaying(false),
    });

    howlRef.current.play();
  }, []);

  const stopPlayback = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      setIsPlaying(false);
    }
  }, []);

  const record = useCallback(() => {
    stopPlayback();
    clearBlobUrl();
    startRecording();
  }, [stopPlayback, clearBlobUrl, startRecording]);

  const playRecord = useCallback(() => {
    if (mediaBlobUrl) {
      play(mediaBlobUrl);
    }
  }, [mediaBlobUrl, play]);

  return {
    // Reproduce
    play,
    isPlaying,
    stopPlayback,
    // Recording
    record,
    playRecord,
    stopRecording,
    mediaBlobUrl,
    isRecording: status === "recording",
    recordingError,
  };
}
