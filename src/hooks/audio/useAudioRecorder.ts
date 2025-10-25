"use client";

import { useEffect, useRef, useState } from "react";
import { rms } from "./utils/rms";
import { zcr } from "./utils/zcr";
import { cosine } from "./utils/cosine";

export type RecorderState = "idle" | "recording" | "stopped" | "playing";
export type AutoStopReason = "timeLimit" | "match";
export type StartOpts = {
  maxDurationMs?: number;
  timesliceMs?: number;
  onAutoStop?: (reason: "timeLimit" | "match") => void;
  refSignature?: number[][];
  matchThreshold?: number; // 0..1 (cosine). ex: 0.92
  consecutiveMatches?: number; // ex: 4-6
  minElapsedMsBeforeMatch?: number; // ex: 300-500ms
  vadRms?: number; // energia mínima p/ considerar voz. ex: 0.015
  vadWarmFrames?: number; // quantos frames com voz antes de permitir match. ex: 6
};

export function useAudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRecordRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const limitTimerRef = useRef<number | null>(null);
  const liveCtxRef = useRef<AudioContext | null>(null);
  const liveAnalyserRef = useRef<AnalyserNode | null>(null);
  const liveBufRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const getSupportedOptions = (): MediaRecorderOptions => {
    // Detected the best MIME supported by browser
    if (typeof window === "undefined" || typeof MediaRecorder === "undefined")
      return {};
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
      return { mimeType: "audio/webm;codecs=opus" };
    if (MediaRecorder.isTypeSupported("audio/webm"))
      return { mimeType: "audio/webm" };
    if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus"))
      return { mimeType: "audio/ogg;codecs=opus" };
    if (MediaRecorder.isTypeSupported("audio/ogg"))
      return { mimeType: "audio/ogg" };
    // Some old browser only accept the default
    return {};
  };

  function attachLiveAnalyser(
    stream: MediaStream,
    mr: MediaRecorder,
    opts?: StartOpts
  ) {
    if (!opts?.refSignature) return;

    const ctx = new (window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    const buf = new Float32Array(analyser.fftSize);
    src.connect(analyser);

    liveCtxRef.current = ctx;
    liveAnalyserRef.current = analyser;
    liveBufRef.current = buf;

    const refSig = opts.refSignature;
    const threshold = opts.matchThreshold ?? 0.92;
    const needConsec = opts.consecutiveMatches ?? 5;
    const minElapsed = opts.minElapsedMsBeforeMatch ?? 400;
    const vadRms = opts.vadRms ?? 0.015;
    const vadWarm = opts.vadWarmFrames ?? 6;

    let consec = 0;
    let frameIx = 0;
    const startedAt = performance.now();
    let voiceFrames = 0;
    let matchingEnabled = false;

    const tick = () => {
      if (!liveAnalyserRef.current || mr.state !== "recording") return;

      analyser.getFloatTimeDomainData(buf);
      const fR = rms(buf);
      const fZ = zcr(buf);

      // VAD: contar frames com voz
      if (fR >= vadRms) {
        voiceFrames++;
        if (
          !matchingEnabled &&
          voiceFrames >= vadWarm &&
          performance.now() - startedAt >= minElapsed
        ) {
          matchingEnabled = true; // só agora permitimos comparar
        }
      }

      if (matchingEnabled) {
        const refIx = Math.min(frameIx, refSig.length - 1);
        const sim = cosine(refSig[refIx], [fR, fZ]);
        if (sim >= threshold) {
          consec++;
          if (consec >= needConsec) {
            mr.stop();
            opts?.onAutoStop?.("match");
            return;
          }
        } else {
          consec = 0;
        }
      }

      frameIx++;
      setTimeout(tick, 50);
    };

    tick();
  }

  function detachLiveAnalyser() {
    try {
      liveAnalyserRef.current?.disconnect();
      liveCtxRef.current?.close();
    } catch {}
    liveAnalyserRef.current = null;
    liveCtxRef.current = null;
    liveBufRef.current = null;
  }

  function clearLimitTimer() {
    if (limitTimerRef.current) {
      window.clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }
  }

  const startRecording = async (opts?: StartOpts) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true },
      });
      streamRef.current = stream;

      const options = getSupportedOptions();
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];
      setMediaRecorder(mr);

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstart = () => setRecorderState("recording");

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
          clearLimitTimer();
          detachLiveAnalyser();
        }
      };

      mr.onerror = (err) => {
        console.error("MediaRecorder error:", err);
        setRecorderState("idle");
        clearLimitTimer();
        detachLiveAnalyser();
      };

      if (opts?.maxDurationMs && opts.maxDurationMs > 0) {
        clearLimitTimer();
        limitTimerRef.current = window.setTimeout(() => {
          if (mr.state === "recording") {
            mr.stop();
            opts?.onAutoStop?.("timeLimit");
          }
        }, opts.maxDurationMs);
      }

      mr.start(opts?.timesliceMs ?? undefined);

      attachLiveAnalyser(stream, mr, opts);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Error accessing microphone, verify permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") mediaRecorder.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
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
    startRecording,
    stopRecording,
    playRecord,
    stopPlayback,
  };
}
