import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { LessonCTA } from "../common/LessonCTA";
import { AudioButton } from "../common/AudioButton";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { useCallback, useMemo } from "react";
import { VoiceLevelIndicator } from "./VoiceLevelIndicator";

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
  const { audioBufferReference, loading, error } = useReferenceAudioV2(
    lessonEntry.audio || ""
  );

  const { recorderState, voiceLevel, audioRecordRef, startRecording } =
    useAudioRecorderV2();

  const { clearScore } = useAudioScoreV2({
    audioBufferReference,
    audioBufferUserRecord: null,
    recorderState,
  });

  const canStart = useMemo(
    () => !!audioBufferReference && !loading && !error,
    [audioBufferReference, loading, error]
  );

  const handleStartRecording = useCallback(() => {
    if (!canStart) return;
    clearScore();
    startRecording({
      maxDurationMs: 5000,
      timesliceMs: 200,
      expectedDurationMs: 820,
    });
  }, [canStart, clearScore, startRecording]);

  if (!show) return null;

  return (
    <>
      <LessonActionContainer title="Pronunciation">
        <LessonEntryInstruction
          audio={lessonEntry.audio}
          instruction={lessonStep.instruction}
        />

        <VoiceLevelIndicator voiceLevel={voiceLevel}>
          <AudioButton
            stepType="pronunciation"
            isRecording={recorderState === "recording"}
            onClick={handleStartRecording}
          />
        </VoiceLevelIndicator>
      </LessonActionContainer>
      <LessonCTA label="NEXT" icon="►" onClick={onClick} />
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </>
  );
}
