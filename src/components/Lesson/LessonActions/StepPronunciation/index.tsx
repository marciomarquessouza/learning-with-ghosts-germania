import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTimeline } from "@/hooks/useTimeline";
import { LessonCTA } from "../common/LessonCTA";
import { useAudioRecorder } from "@/libs/audio/useAudioRecorder";
import { useReferenceAudio } from "@/libs/audio/useReferenceAudio";
import { useAudioScore } from "@/libs/audio/useAudioScore";
import { AudioProgress } from "./AudioProgress";
import { VoiceIndicator } from "./VoiceIndicator";

export interface StepPronunciationProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  show: boolean;
  onClick: () => void;
}

export function StepPronunciation({
  lessonEntry,
  lessonStep,
  show,
  onClick,
}: StepPronunciationProps) {
  const {
    refAB,
    refSig,
    loading: refLoading,
    error: refError,
  } = useReferenceAudio(lessonEntry.audio || "");
  const {
    recorderState,
    lastBlob,
    audioUrl,
    audioRecordRef,
    voiceLevel,
    playRecord,
    startRecording,
    stopRecording,
  } = useAudioRecorder();
  const { score, clearScore } = useAudioScore({
    refAB,
    recorderState,
    lastBlob,
  });
  const [visible, setVisible] = useState(false);
  const flags = useTimeline({
    lines: [
      {
        key: "showReference",
        time: 40,
      },
    ],
    started: visible,
  });
  const canStart = useMemo(
    () => !!refSig && !refLoading && !refError,
    [refSig, refLoading, refError]
  );

  const handleStartRecording = useCallback(() => {
    clearScore();
    startRecording({
      maxDurationMs: 5000,
      timesliceMs: 200,
      expectedDurationMs: 820,
    });
  }, [clearScore, startRecording]);

  useEffect(() => {
    if (show && !visible) setVisible(true);
  }, [show, visible]);

  if (!visible) return null;

  return (
    <>
      <LessonActionContainer title="Pronunciation">
        <LessonEntryInstruction
          audio={lessonEntry.audio}
          instruction={lessonStep.instruction}
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartRecording}
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
                  ? "bg-black opacity-40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15 active:scale-[.98]"
              }
            `}
            aria-label="Parar gravação"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#fff"
              aria-hidden="true"
            >
              <rect x="7" y="7" width="10" height="10" rx="1.5" />
            </svg>
            Parar gravação
          </button>
        </div>
        <div className="w-full">
          {/* {true && (
          <AudioProgress
            audioRecordRef={audioRecordRef}
            state={recorderState}
          />
        )} */}
          {recorderState === "recording" && (
            <VoiceIndicator level={voiceLevel} isRecording={true} />
          )}
        </div>
      </LessonActionContainer>
      <LessonCTA label="NEXT" icon="►" onClick={onClick} />
    </>
  );
}
