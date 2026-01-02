import { useCallback, useEffect, useMemo, useState } from "react";
import { LessonComponentProps, StepPhases } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { PronunciationDialog } from "./PronunciationDialog";
import { PronunciationFeedback } from "./PronunciationFeedback";
import { DialogContainer } from "../common/DialogContainer";
import { StepControls } from "./StepControls";

export function StepPronunciation({
  lessonEntry,
  lessonStep,
  onClickPrevious,
  onClickNext,
  onResult,
}: LessonComponentProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<StepPhases>("pronunciation");
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
      setPhase("result:analysis");
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
        {visible && phase === "result:analysis" && !!score && (
          <PronunciationFeedback
            scoreResult={score}
            lessonEntry={lessonEntry}
            isPlaying={recorderState === "playing"}
            onClickReproduce={handlePlayback}
            onResult={onResult}
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
