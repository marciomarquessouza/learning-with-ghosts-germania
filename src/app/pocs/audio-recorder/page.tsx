"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RecorderState,
  useAudioRecorder,
} from "@/hooks/audio/useAudioRecorder";
import {
  scoreRecording,
  ScoreResult,
} from "@/hooks/audio/utils/scoreRecording";
import { useReferenceAudio } from "@/hooks/audio/useReferenceAudio";

/** =========================
 *  Configuração (ajuste por item)
 *  ========================= */
const REF_URL = "/audio/de/day_01/hallo.3da730fc.mp3";
const MAX_DURATION_MS = 3_500;

const LIVE_MATCH = {
  matchThreshold: 0.93, // 0..1 (cosine)
  consecutiveMatches: 6, // frames seguidos
  minElapsedMsBeforeMatch: 450, // atraso mínimo
  vadRms: 0.015, // energia mínima para voz
  vadWarmFrames: 6, // frames de aquecimento
} as const;

const SCORING = {
  frameSize: 1024,
  hop: 512,
  minDurationSec: 0.35,
  maxDurationSec: 1.2,
  minMeanRms: 0.02,
} as const;

/** =========================
 *  Página POC
 *  ========================= */
export default function PocaudioPage() {
  const {
    refAB,
    refSig,
    loading: refLoading,
    error: refError,
  } = useReferenceAudio(REF_URL);
  const audioRecorder = useAudioRecorder();
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [autoStopReason, setAutoStopReason] = useState<
    "timeLimit" | "match" | null
  >(null);

  const canStart = useMemo(
    () => !!refSig && !refLoading && !refError,
    [refSig, refLoading, refError]
  );

  const handleStart = useCallback(() => {
    setScore(null);
    setAutoStopReason(null);
    audioRecorder.startRecording({
      maxDurationMs: MAX_DURATION_MS,
      timesliceMs: 200,
      onAutoStop: (r) => setAutoStopReason(r),
      refSignature: refSig ?? undefined,
      ...LIVE_MATCH,
    });
  }, [audioRecorder, refSig]);

  // Scoring pós-gravação
  useEffect(() => {
    if (audioRecorder.recorderState !== "stopped") return;
    if (!audioRecorder.lastBlob || !refAB) return;

    let cancelled = false;
    (async () => {
      const s = await scoreRecording(refAB, audioRecorder.lastBlob!, SCORING);
      if (!cancelled) setScore(s);
    })();

    return () => {
      cancelled = true;
    };
  }, [audioRecorder.recorderState, audioRecorder.lastBlob, refAB]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#FFF3E4] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          POC: Gravar e reproduzir áudio
        </h1>

        <p className="mt-1 text-sm/6 text-[#c7c7c7]">
          Estado:{" "}
          <strong className="text-white">{audioRecorder.recorderState}</strong>
        </p>

        {refLoading && (
          <p className="mt-2 text-xs text-[#9c9c9c]">Carregando referência…</p>
        )}
        {refError && <p className="mt-2 text-xs text-red-400">{refError}</p>}

        {/* Controles */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleStart}
            disabled={!canStart || audioRecorder.recorderState === "recording"}
            className={`group inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                !canStart || audioRecorder.recorderState === "recording"
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-[#C20013] hover:bg-[#a10011] active:scale-[.98]"
              }
            `}
            aria-label="Iniciar gravação"
            title={
              !canStart ? "Aguarde a referência carregar" : "Iniciar gravação"
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={`transition ${
                audioRecorder.recorderState === "recording"
                  ? ""
                  : "animate-pulse"
              }`}
            >
              <circle cx="12" cy="12" r="8" />
            </svg>
            Iniciar gravação
          </button>

          <button
            onClick={audioRecorder.stopRecording}
            disabled={audioRecorder.recorderState !== "recording"}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                audioRecorder.recorderState !== "recording"
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15 active:scale-[.98]"
              }
            `}
            aria-label="Parar gravação"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="7" y="7" width="10" height="10" rx="1.5" />
            </svg>
            Parar gravação
          </button>

          <button
            onClick={audioRecorder.playRecord}
            disabled={
              !audioRecorder.audioUrl ||
              audioRecorder.recorderState === "recording"
            }
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                !audioRecorder.audioUrl ||
                audioRecorder.recorderState === "recording"
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15 active:scale-[.98]"
              }
            `}
            aria-label="Reproduzir"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Reproduzir
          </button>

          <button
            onClick={audioRecorder.stopPlayback}
            disabled={audioRecorder.recorderState !== "playing"}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                audioRecorder.recorderState !== "playing"
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15 active:scale-[.98]"
              }
            `}
            aria-label="Parar reprodução"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 6h12v12H6z" />
            </svg>
            Parar reprodução
          </button>
        </div>

        {/* Barra de progresso e tempo */}
        {audioRecorder.audioRecordRef && (
          <AudioProgress
            audioRecordRef={audioRecorder.audioRecordRef}
            state={audioRecorder.recorderState}
          />
        )}

        {/* Elemento de áudio oculto (motor) */}
        <audio
          ref={audioRecorder.audioRecordRef}
          preload="metadata"
          className="hidden"
        />

        {/* Feedback de auto-stop e score */}
        <div className="mt-4 text-xs text-[#bdbdbd]">
          {autoStopReason && (
            <div className="mb-1">
              Auto-stop:{" "}
              <span className="text-white">
                {autoStopReason === "match" ? "match" : "tempo"}
              </span>
            </div>
          )}
          {score && (
            <div className="mt-3 text-sm">
              <div>
                Score: <strong>{score.score}</strong> / 100
              </div>
              <div>DTW distance: {score.distance.toFixed(3)}</div>
              <div>
                Duração ref: {score.durRef.toFixed(2)}s | usuário:{" "}
                {score.durUser.toFixed(2)}s
              </div>
              <div>Relação de duração: {score.durRatio.toFixed(2)}</div>
              <div>RMS médio usuário: {score.meanRmsUser.toFixed(3)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** =========================
 *  Progresso visual
 *  ========================= */
function AudioProgress({
  audioRecordRef,
  state,
}: {
  audioRecordRef: React.RefObject<HTMLAudioElement | null>;
  state: RecorderState;
}) {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRecordRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime || 0);
    const onLoaded = () => setDuration(el.duration || 0);
    const onEnded = () => setCurrent(0);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
    };
  }, [audioRecordRef]);

  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-xs text-[#bdbdbd]">
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full ${
            state === "playing"
              ? "animate-[pulse_1.6s_ease-in-out_infinite]"
              : ""
          }`}
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#C20013,#ff3b30)",
          }}
        />
      </div>
    </div>
  );
}

function formatTime(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
