import { useCallback, useEffect, useMemo, useState } from "react";
import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { PronunciationDialog } from "./PronunciationDialog";
import { PronunciationFeedback } from "./PronunciationFeedback";
import { DialogContainer } from "../common/DialogContainer";
import { StepControls } from "./StepControls";

export interface StepPronunciationProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  onClickPrevious: () => void;
  onClickNext: () => void;
}

export type Phases = "pronunciation" | "result";

export function StepPronunciation({
  lessonEntry,
  lessonStep,
  onClickPrevious,
  onClickNext,
}: StepPronunciationProps) {
  const [visible, setVisible] = useState(false);
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

  return (
    <DialogContainer onAnimationComplete={() => setVisible(true)}>
      <LessonActionContainer title="Pronunciation">
        {visible && phase === "pronunciation" && (
          <PronunciationDialog
            lessonEntry={lessonEntry}
            lessonStep={lessonStep}
            voiceLevel={voiceLevel}
            recorderState={recorderState}
            onRecord={handleRecording}
          />
        )}
        {visible && phase === "result" && !!score && (
          <PronunciationFeedback
            scoreResult={score}
            lessonEntry={lessonEntry}
            isPlaying={recorderState === "playing"}
            onClickReproduce={handlePlayback}
          />
        )}
      </LessonActionContainer>
      <StepControls
        phase={phase}
        onClickPrevious={onClickPrevious}
        onClickNext={onClickNext}
        onClickRetry={handleTryAgain}
      />
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </DialogContainer>
  );
}
