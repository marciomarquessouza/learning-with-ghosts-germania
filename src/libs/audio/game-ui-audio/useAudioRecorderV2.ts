"use client";
import { useEffect, useRef, useState } from "react";
import { useVoiceAnalysis } from "./useVoiceAnalysis";
import { getSupportedOptions } from "./utils/getSupportedOptions";

export type RecorderState =
  | "idle"
  | "starting"
  | "recording"
  | "stopped"
  | "playing";

export type AutoStopReason = "timeLimit" | "match";

export type StartOpts = {
  maxDurationMs?: number;
  timesliceMs?: number;
  onAutoStop?: (reason: AutoStopReason) => void;
  expectedDurationMs?: number;
};

let cachedRecorderOptions: MediaRecorderOptions | null = null;
const getCachedOptions = (): MediaRecorderOptions => {
  if (!cachedRecorderOptions) {
    cachedRecorderOptions = getSupportedOptions();
  }
  return cachedRecorderOptions;
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

  const cleanupRecording = () => {
    stopVoiceAnalysis();
    setVoiceLevel(0);

    if (limitTimerRef.current) {
      window.clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        t.stop();
        t.enabled = false;
      });
      streamRef.current = null;
    }

    setMediaRecorder(null);
  };

  useEffect(() => {
    return () => {
      cleanupRecording();

      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state !== "closed") {
            audioContextRef.current.close();
          }
        } catch (e) {
          console.error("Error closing AudioContext on unmount", e);
        } finally {
          audioContextRef.current = null;
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const startRecording = async (opts?: StartOpts) => {
    try {
      setRecorderState("starting");
      setVoiceLevel(0);

      cleanupRecording();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          sampleRate: 16000,
        },
      });

      const audioContext = ensureAudioContext();
      streamRef.current = stream;

      const options = getCachedOptions();
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

          const ctx = ensureAudioContext();
          blob
            .arrayBuffer()
            .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
            .then((audioBufferResponse) => {
              setAudioBufferUserRecord(audioBufferResponse);
            })
            .catch((error) => {
              console.error("Error decoding audio data", error);
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
          cleanupRecording();
        }
      };

      mr.onerror = (err) => {
        console.error("MediaRecorder error:", err);
        setRecorderState("idle");
        cleanupRecording();
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
      setRecorderState("idle");
      alert("Error accessing microphone, verify permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      return;
    }
    cleanupRecording();
    setRecorderState("idle");
  };

  const playRecord = async () => {
    if (!audioUrl || !audioRecordRef.current) return;

    const audioEl = audioRecordRef.current as HTMLAudioElement;

    try {
      const handleEnded = () => {
        setRecorderState("idle");
      };
      audioEl.removeEventListener("ended", handleEnded);
      audioEl.addEventListener("ended", handleEnded);

      await audioEl.play();
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
