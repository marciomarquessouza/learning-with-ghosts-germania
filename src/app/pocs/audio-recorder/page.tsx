"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useReferenceAudio } from "@/libs/audio/useReferenceAudio";
import { useAudioRecorder } from "@/libs/audio/useAudioRecorder";
import { ScoreFeedback } from "./ScoreFeedback";
import { VoiceIndicator } from "./VoiceIndicator";
import { AudioProgress } from "./AudioProgress";
import { useAudioScore } from "@/libs/audio/useAudioScore";

const REF_URL = "/audio/de/day_01/hallo.3da730fc.mp3";

/** =========================
 *  POC Page
 *  ========================= */
export default function PocaudioPage() {
  const {
    refAB,
    refSig,
    loading: refLoading,
    error: refError,
  } = useReferenceAudio(REF_URL);
  const audioRecorder = useAudioRecorder();
  const { score, clearScore } = useAudioScore({
    refAB,
    recorderState: audioRecorder.recorderState,
    lastBlob: audioRecorder.lastBlob,
  });

  const [autoStopReason, setAutoStopReason] = useState<
    "timeLimit" | "match" | null
  >(null);

  const canStart = useMemo(
    () => !!refSig && !refLoading && !refError,
    [refSig, refLoading, refError]
  );

  const handleStart = useCallback(() => {
    clearScore();
    setAutoStopReason(null);
    audioRecorder.startRecording({
      maxDurationMs: 5000,
      timesliceMs: 200,
      onAutoStop: (r) => {
        setAutoStopReason(r);
      },
      expectedDurationMs: 820,
    });
  }, [audioRecorder, clearScore]);

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

        {audioRecorder.recorderState === "recording" && (
          <VoiceIndicator level={audioRecorder.voiceLevel} isRecording={true} />
        )}

        {audioRecorder.audioRecordRef && (
          <AudioProgress
            audioRecordRef={audioRecorder.audioRecordRef}
            state={audioRecorder.recorderState}
          />
        )}

        <audio
          ref={audioRecorder.audioRecordRef}
          preload="metadata"
          className="hidden"
        />

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
