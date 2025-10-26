"use client";

import { useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "stopped" | "playing";
export type AutoStopReason = "timeLimit" | "match";

export type StartOpts = {
  maxDurationMs?: number;
  timesliceMs?: number;
  onAutoStop?: (reason: AutoStopReason) => void;
  expectedDurationMs?: number;
};

export function useAudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const audioRecordRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const limitTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const voiceAnalysisRef = useRef<{ running: boolean }>({ running: false });

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const getSupportedOptions = (): MediaRecorderOptions => {
    if (typeof window === "undefined" || typeof MediaRecorder === "undefined")
      return {};

    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return { mimeType: type };
      }
    }

    return {};
  };

  const cleanup = () => {
    voiceAnalysisRef.current.running = false;
    setVoiceLevel(0);

    if (limitTimerRef.current) {
      window.clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }

    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      analyserRef.current = null;
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
        startVoiceAnalysis(stream, mr, opts);
      };

      mr.onstop = () => {
        try {
          const type =
            mr.mimeType || (options.mimeType as string) || "audio/webm";
          const blob = new Blob(chunksRef.current, { type });

          setLastBlob(blob);

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

  const startVoiceAnalysis = (
    stream: MediaStream,
    mr: MediaRecorder,
    opts?: StartOpts
  ) => {
    const ctx = new (window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    const buffer = new Float32Array(analyser.fftSize);

    src.connect(analyser);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    const expectedDuration = opts?.expectedDurationMs ?? 1000;
    const startedAt = performance.now();
    let voiceDetected = false;
    let voiceStartTime = 0;
    let consecutiveSilence = 0;

    voiceAnalysisRef.current.running = true;

    const checkVoice = () => {
      if (!voiceAnalysisRef.current.running || mr.state !== "recording") {
        return;
      }

      try {
        analyser.getFloatTimeDomainData(buffer);

        // Calculate the RMS
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sum / buffer.length);

        // Update voice level (normalize to 0-1)
        // Typical RMS for voice: 0.01 to 0.1, so we normalize for visualization
        const normalizedLevel = Math.min(1, rms / 0.1);
        setVoiceLevel(normalizedLevel);

        const currentTime = performance.now();
        const elapsed = currentTime - startedAt;

        const silenceThreshold = 0.008;
        const voiceThreshold = 0.015;

        if (rms > voiceThreshold) {
          if (!voiceDetected) {
            voiceDetected = true;
            voiceStartTime = currentTime;
            consecutiveSilence = 0;
          }

          const voiceDuration = currentTime - voiceStartTime;

          if (voiceDuration >= expectedDuration * 0.8) {
            voiceAnalysisRef.current.running = false;
            mr.stop();
            opts?.onAutoStop?.("match");
            return;
          }
        } else if (rms < silenceThreshold) {
          consecutiveSilence++;

          if (voiceDetected && consecutiveSilence > 8) {
            const voiceDuration = currentTime - voiceStartTime;
            if (voiceDuration >= expectedDuration * 0.5) {
              voiceAnalysisRef.current.running = false;
              mr.stop();
              opts?.onAutoStop?.("match");
              return;
            }
          }
        }

        if (elapsed > expectedDuration * 3) {
          voiceAnalysisRef.current.running = false;
          mr.stop();
          opts?.onAutoStop?.("timeLimit");
          return;
        }
        setTimeout(checkVoice, 50);
      } catch (error) {
        console.error("Voice analysis error:", error);
        voiceAnalysisRef.current.running = false;
      }
    };

    checkVoice();
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
    recorderState,
    audioRecordRef,
    audioUrl,
    lastBlob,
    voiceLevel,
    startRecording,
    stopRecording,
    playRecord,
    stopPlayback,
  };
}
