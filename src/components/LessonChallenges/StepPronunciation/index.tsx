import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  isFirst,
  isLast,
  lessonEntry,
  lessonStep,
  onClickPrevious,
  onClickNext,
  onResult,
  reproduceTargetAudioOnStart,
}: LessonComponentProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<StepPhases>("pronunciation");
  const [waitingRecord, setWaitingRecord] = useState(false);

  const didAutoStartOnOpenRef = useRef(false);
  const [pendingAutoRecord, setPendingAutoRecord] = useState(false);

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

  const { score, clearScore, scoreSummary } = useAudioScoreV2({
    audioBufferReference,
    audioBufferUserRecord,
    recorderState,
  });

  const canStart = useMemo(
    () => !!audioBufferReference && !loading && !error,
    [audioBufferReference, loading, error]
  );

  const isBusy = recorderState === "recording" || recorderState === "playing";

  const startPronunciationRecording = useCallback(() => {
    if (!canStart) return;

    clearScore();
    setWaitingRecord(true);

    startRecording({
      maxDurationMs: 5000,
      timesliceMs: 200,
      expectedDurationMs: 1200,
    });
  }, [canStart, clearScore, startRecording]);

  const handleRecording = useCallback(() => {
    if (recorderState === "recording") {
      stopRecording();
      return;
    }
    startPronunciationRecording();
  }, [recorderState, stopRecording, startPronunciationRecording]);

  const handlePlayback = useCallback(() => {
    if (recorderState === "playing") {
      stopPlayback();
      return;
    }
    playRecord();
  }, [recorderState, playRecord, stopPlayback]);

  useEffect(() => {
    if (!reproduceTargetAudioOnStart) return;
    if (!visible) return;
    if (!canStart) return;

    if (phase !== "pronunciation") return;
    if (score) return;

    if (isBusy) return;

    if (didAutoStartOnOpenRef.current) return;
    didAutoStartOnOpenRef.current = true;

    setTimeout(() => {
      startPronunciationRecording();
    }, 1000);
  }, [
    reproduceTargetAudioOnStart,
    visible,
    canStart,
    phase,
    score,
    isBusy,
    startPronunciationRecording,
  ]);

  useEffect(() => {
    if (!reproduceTargetAudioOnStart) return;
    if (!pendingAutoRecord) return;

    if (!visible) return;
    if (!canStart) return;

    if (phase !== "pronunciation") return;
    if (score) return;

    if (isBusy) return;

    setPendingAutoRecord(false);
    startPronunciationRecording();
  }, [
    reproduceTargetAudioOnStart,
    pendingAutoRecord,
    visible,
    canStart,
    phase,
    score,
    isBusy,
    startPronunciationRecording,
  ]);

  useEffect(() => {
    if (!score) return;
    setPendingAutoRecord(false);
    setPhase("result:analysis");
  }, [score]);

  useEffect(() => {
    if (waitingRecord && recorderState === "recording") {
      setWaitingRecord(false);
    }
  }, [recorderState, waitingRecord]);

  useEffect(() => {
    didAutoStartOnOpenRef.current = false;
    setPendingAutoRecord(false);
    setWaitingRecord(false);
    setPhase("pronunciation");
    clearScore();

    if (recorderState === "playing") stopPlayback();
    if (recorderState === "recording") stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonEntry.id, lessonStep?.type]);

  const handleTryAgain = useCallback(() => {
    clearScore();

    setPhase("pronunciation");

    if (recorderState === "playing") stopPlayback();
    if (recorderState === "recording") stopRecording();

    if (reproduceTargetAudioOnStart) {
      setPendingAutoRecord(true);
    }
  }, [
    clearScore,
    recorderState,
    stopPlayback,
    stopRecording,
    reproduceTargetAudioOnStart,
  ]);

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
            reproduceTargetAudioOnStart={reproduceTargetAudioOnStart}
          />
        )}

        {visible && phase === "result:analysis" && !!score && (
          <PronunciationFeedback
            scoreResult={score}
            lessonEntry={lessonEntry}
            isPlaying={recorderState === "playing"}
            audioScoreSummary={scoreSummary}
            onClickReproduce={handlePlayback}
          />
        )}
      </LessonActionContainer>

      <StepControls
        isFirst={isFirst}
        isLast={isLast}
        phase={phase}
        onClickPrevious={onClickPrevious}
        onClickNext={onClickNext}
        onClickRetry={handleTryAgain}
      />

      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </DialogContainer>
  );
}
