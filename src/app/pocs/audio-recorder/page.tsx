"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ScoreFeedback } from "./ScoreFeedback";
import { VoiceIndicator } from "./VoiceIndicator";
import { AudioProgress } from "./AudioProgress";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";

const REFERENCE_URL = "/audio/de/day_01/hallo.3da730fc.mp3";

/** =========================
 *  POC Page
 *  ========================= */
export default function PocAudioPage() {
  const {
    audioBufferReference,
    loading: referenceLoading,
    error: referenceError,
  } = useReferenceAudioV2(REFERENCE_URL);

  const {
    audioBufferUserRecord,
    recorderState,
    audioRecordRef,
    audioUrl,
    voiceLevel,
    startRecording,
    stopRecording,
    playRecord,
    stopPlayback,
  } = useAudioRecorderV2();

  const { score, clearScore } = useAudioScoreV2({
    audioBufferReference,
    audioBufferUserRecord,
    recorderState,
  });

  const [autoStopReason, setAutoStopReason] = useState<
    "timeLimit" | "match" | null
  >(null);

  const canStart = useMemo(
    () => !!audioBufferReference && !referenceLoading && !referenceError,
    [audioBufferReference, referenceLoading, referenceError]
  );

  const handleStart = useCallback(() => {
    clearScore();
    setAutoStopReason(null);
    startRecording({
      maxDurationMs: 5000,
      timesliceMs: 200,
      onAutoStop: (reason) => {
        setAutoStopReason(reason);
      },
      expectedDurationMs: 820,
    });
  }, [clearScore, startRecording]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#FFF3E4] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          POC: Gravar e reproduzir áudio
        </h1>

        <p className="mt-1 text-sm/6 text-[#c7c7c7]">
          Estado: <strong className="text-white">{recorderState}</strong>
        </p>

        {referenceLoading && (
          <p className="mt-2 text-xs text-[#9c9c9c]">Carregando referência…</p>
        )}
        {referenceError && (
          <p className="mt-2 text-xs text-red-400">{referenceError}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleStart}
            disabled={!canStart || recorderState === "recording"}
            className={`group inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                !canStart || recorderState === "recording"
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-[#C20013] hover:bg-[#a10011] active:scale-[.98]"
              }
            `}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={`transition ${
                recorderState === "recording" ? "" : "animate-pulse"
              }`}
            >
              <circle cx="12" cy="12" r="8" />
            </svg>
            Iniciar gravação
          </button>

          <button
            onClick={stopRecording}
            disabled={recorderState !== "recording"}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                recorderState !== "recording"
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
            onClick={playRecord}
            disabled={!audioUrl || recorderState === "recording"}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                !audioUrl || recorderState === "recording"
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
            onClick={stopPlayback}
            disabled={recorderState !== "playing"}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-md ring-1 ring-white/10 transition
              ${
                recorderState !== "playing"
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

        {recorderState === "recording" && (
          <VoiceIndicator level={voiceLevel} isRecording={true} />
        )}

        {audioRecordRef && (
          <AudioProgress
            audioRecordRef={audioRecordRef}
            state={recorderState}
          />
        )}

        <div>
          <audio ref={audioRecordRef} preload="metadata" className="hidden" />
        </div>

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
            <div className="mt-4 text-sm">
              <div className="flex items-center gap-4 mb-3">
                <div>
                  Score: <strong className="text-xl">{score.score}</strong> /
                  100
                </div>
                <ScoreFeedback score={score.score} />
              </div>
              <div className="text-xs text-[#bdbdbd] space-y-1">
                <div>DTW distance: {score.distance.toFixed(3)}</div>
                <div>
                  Duração ref: {score.durRef.toFixed(2)}s | usuário:{" "}
                  {score.durUser.toFixed(2)}s
                </div>
                <div>Relação de duração: {score.durRatio.toFixed(2)}</div>
                <div>RMS médio usuário: {score.meanRmsUser.toFixed(3)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
