import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { LessonCTA } from "../common/LessonCTA";
import { AudioButton } from "../common/AudioButton";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VoiceLevelIndicator } from "./VoiceLevelIndicator";

export interface StepPronunciationProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  show: boolean;
  onClick: () => void;
}

type Phases = "before-challenge" | "result";

export function StepPronunciation({
  lessonEntry,
  lessonStep,
  show,
  onClick,
}: StepPronunciationProps) {
  const [challengePhase, setChallengePhase] =
    useState<Phases>("before-challenge");
  const [waitingRecord, setWaitingRecord] = useState(false);
  const { audioBufferReference, loading, error } = useReferenceAudioV2(
    lessonEntry.audio || ""
  );

  const {
    recorderState,
    voiceLevel,
    audioRecordRef,
    startRecording,
    stopRecording,
  } = useAudioRecorderV2();

  const { clearScore } = useAudioScoreV2({
    audioBufferReference,
    audioBufferUserRecord: null,
    recorderState,
  });

  const canStart = useMemo(
    () => !!audioBufferReference && !loading && !error,
    [audioBufferReference, loading, error]
  );

  const { icon, color, label } = useMemo(() => {
    switch (challengePhase) {
      case "before-challenge":
        return {
          icon: "⏭",
          label: "SKIP",
          color: "bg-[#976ED4] hover:bg-[#6700FF]",
        };
      default:
        return {
          icon: "►",
          label: "NEXT",
          color: "bg-[#B40F00] hover:bg-[#941729]",
        };
    }
  }, [challengePhase]);

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

  useEffect(() => {
    if (waitingRecord && recorderState === "recording") {
      setWaitingRecord(false);
    }
  }, [recorderState, waitingRecord]);

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
            isLoading={recorderState === "starting"}
            onClick={handleRecording}
          />
        </VoiceLevelIndicator>
        {recorderState === "starting" && (
          <p className="text-gray-600 font-mono">WAIT</p>
        )}
        {recorderState === "recording" && (
          <p className="text-gray-600 font-mono">SPEAK!</p>
        )}
      </LessonActionContainer>
      <LessonCTA label={label} icon={icon} color={color} onClick={onClick} />
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </>
  );
}
