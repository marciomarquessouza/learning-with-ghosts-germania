"use client";

import { useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "stopped" | "playing";

export function useAudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRecordRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  const startRecording = async () => {
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
        }
      };

      mr.onerror = (err) => {
        console.error("MediaRecorder error:", err);
        setRecorderState("idle");
      };

      mr.start();
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
    startRecording,
    stopRecording,
    playRecord,
    stopPlayback,
  };
}
