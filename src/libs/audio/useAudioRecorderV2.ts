"use client";

import { useEffect, useRef, useState } from "react";
import { useVoiceAnalysis } from "./useVoiceAnalysis";
import { getSupportedOptions } from "./utils/getSupportedOptions";

export type RecorderState = "idle" | "recording" | "stopped" | "playing";
export type AutoStopReason = "timeLimit" | "match";

export type StartOpts = {
  maxDurationMs?: number;
  timesliceMs?: number;
  onAutoStop?: (reason: AutoStopReason) => void;
  expectedDurationMs?: number;
};

export function useAudioRecorderV2() {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [audioBufferUserRecord, setAudioBufferUserRecord] =
    useState<AudioBuffer | null>(null);

  const audioRecordRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const limitTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const { createVoiceAnalysis, stopVoiceAnalysis } = useVoiceAnalysis();

  useEffect(() => {
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanup = () => {
    stopVoiceAnalysis();
    setVoiceLevel(0);

    if (limitTimerRef.current) {
      window.clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== "closed") {
          audioContextRef.current.close();
        }
      } catch (e) {
        console.error("AudioContext already closed");
      }
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        t.stop();
        t.enabled = false;
      });
      streamRef.current = null;
    }
  };

  const startRecording = async (opts?: StartOpts) => {
    try {
      cleanup();
      setVoiceLevel(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          sampleRate: 16000,
        },
      });

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      streamRef.current = stream;

      const options = getSupportedOptions();
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];
      setMediaRecorder(mr);

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstart = () => {
        setRecorderState("recording");

        // Create and start voice analysis
        const voiceAnalysis = createVoiceAnalysis(
          stream,
          mr,
          audioContext,
          opts
        );
        voiceAnalysis.start(setVoiceLevel);
      };

      mr.onstop = () => {
        try {
          const type =
            mr.mimeType || (options.mimeType as string) || "audio/webm";
          const blob = new Blob(chunksRef.current, { type });
          const audioContext = audioContextRef.current;

          blob.arrayBuffer().then((arrayBuffer) => {
            if (audioContext) {
              audioContext
                .decodeAudioData(arrayBuffer)
                .then((audioBufferResponse) => {
                  setAudioBufferUserRecord(audioBufferResponse);
                })
                .catch((error) => {
                  throw new Error(error);
                });
            } else {
              throw new Error("No Audio Context");
            }
          });

          if (audioUrl) URL.revokeObjectURL(audioUrl);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setRecorderState("stopped");

          if (audioRecordRef.current) {
            audioRecordRef.current.src = url;
            audioRecordRef.current.load();
          }
        } finally {
          chunksRef.current = [];
          cleanup();
        }
      };

      mr.onerror = (err) => {
        console.error("MediaRecorder error:", err);
        setRecorderState("idle");
        cleanup();
      };

      if (opts?.maxDurationMs && opts.maxDurationMs > 0) {
        limitTimerRef.current = window.setTimeout(() => {
          if (mr.state === "recording") {
            mr.stop();
            opts?.onAutoStop?.("timeLimit");
          }
        }, opts.maxDurationMs);
      }

      mr.start(opts?.timesliceMs ?? 100);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Error accessing microphone, verify permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    cleanup();
  };

  const playRecord = async () => {
    if (!audioUrl || !audioRecordRef.current) return;
    try {
      await audioRecordRef.current.play();
      setRecorderState("playing");
    } catch (e) {
      console.error(e);
      alert("Error playing audio, please try again in a different browser.");
    }
  };

  const stopPlayback = () => {
    if (!audioRecordRef.current) return;
    audioRecordRef.current.pause();
    audioRecordRef.current.currentTime = 0;
    setRecorderState("stopped");
  };

  return {
    audioBufferUserRecord,
    recorderState,
    audioRecordRef,
    audioUrl,
    voiceLevel,
    startRecording,
    stopRecording,
    playRecord,
    stopPlayback,
  };
}
