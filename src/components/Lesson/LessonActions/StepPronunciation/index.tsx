import { useCallback, useEffect, useMemo, useState } from "react";
import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { PronunciationDialog } from "./PronunciationDialog";
import { LessonCTA } from "../common/LessonCTA";
import { PronunciationFeedback } from "./PronunciationFeedback";
import { Button } from "@/components/Button";

export interface StepPronunciationProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  show: boolean;
  onClick: () => void;
}

type Phases = "pronunciation" | "result";

export function StepPronunciation({
  lessonEntry,
  lessonStep,
  show,
  onClick,
}: StepPronunciationProps) {
  const [phase, setPhase] = useState<Phases>("pronunciation");
  const [waitingRecord, setWaitingRecord] = useState(false);
  const { audioBufferReference, loading, error } = useReferenceAudioV2(
    lessonEntry.audio || ""
  );

  const {
    recorderState,
    voiceLevel,
    audioRecordRef,
    audioBufferUserRecord,
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

  const canStart = useMemo(
    () => !!audioBufferReference && !loading && !error,
    [audioBufferReference, loading, error]
  );

  const handleRecording = useCallback(() => {
    if (recorderState === "recording") {
      stopRecording();
      return;
    }

    setWaitingRecord(true);

    if (!canStart) return;
    clearScore();
    startRecording({
      maxDurationMs: 5000,
      timesliceMs: 200,
      expectedDurationMs: 820,
    });
  }, [canStart, clearScore, recorderState, startRecording, stopRecording]);

  const handlePlayback = useCallback(() => {
    if (recorderState === "playing") {
      stopPlayback();
      return;
    }
    playRecord();
  }, [recorderState, playRecord, stopPlayback]);

  const handleTryAgain = () => {
    clearScore();
    setPhase("pronunciation");
  };

  useEffect(() => {
    if (waitingRecord && recorderState === "recording") {
      setWaitingRecord(false);
    }
  }, [recorderState, waitingRecord]);

  useEffect(() => {
    if (score) {
      setPhase("result");
    }
  }, [score]);

  if (!show) return null;

  return (
    <>
      <LessonActionContainer title="Pronunciation">
        {phase === "pronunciation" && (
          <PronunciationDialog
            lessonEntry={lessonEntry}
            lessonStep={lessonStep}
            voiceLevel={voiceLevel}
            recorderState={recorderState}
            onRecord={handleRecording}
          />
        )}
        {phase === "result" && !!score && (
          <PronunciationFeedback
            scoreResult={score}
            lessonEntry={lessonEntry}
            isPlaying={recorderState === "playing"}
            onClickReproduce={handlePlayback}
          />
        )}
      </LessonActionContainer>
      <div className="absolute right-4 -bottom-6">
        <div className="flex flex-row gap-4">
          {phase === "result" && (
            <Button
              label="TRY AGAIN"
              labelIcon="↻"
              color="bg-[#976ED4] hover:bg-[#6700FF]"
              onClick={handleTryAgain}
            />
          )}
          <Button
            label={phase === "pronunciation" ? "SKIP" : "NEXT"}
            labelIcon={phase === "pronunciation" ? "⏭" : "►"}
            color={
              phase === "pronunciation"
                ? "bg-[#976ED4] hover:bg-[#6700FF]"
                : "bg-[#B40F00] hover:bg-[#941729]"
            }
            onClick={onClick}
          />
        </div>
      </div>
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </>
  );
}
