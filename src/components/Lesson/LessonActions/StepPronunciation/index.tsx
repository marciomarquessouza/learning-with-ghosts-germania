import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { LessonCTA } from "../common/LessonCTA";
import { AudioButton } from "../common/AudioButton";
import { useReferenceAudioV2 } from "@/libs/audio/useReferenceAudioV2";
import { useAudioRecorderV2 } from "@/libs/audio/useAudioRecorderV2";
import { useAudioScoreV2 } from "@/libs/audio/useAudioScoreV2";
import { useCallback, useMemo } from "react";

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

  // level -> 0..100 (half bar).
  const amplified = Math.pow(voiceLevel, 0.3);
  const halfPct = Math.min(100, amplified * 300); // half
  const mirroredWidth = Math.min(100, halfPct * 2);

  return (
    <>
      <LessonActionContainer title="Pronunciation">
        <LessonEntryInstruction
          audio={lessonEntry.audio}
          instruction={lessonStep.instruction}
        />

        <div className="mt-2 w-[520px] mx-auto text-center">
          <div className="relative flex items-center justify-center">
            <div className="relative h-3 w-full rounded-full bg-[#efe6d9] shadow-[0_1px_0_rgba(0,0,0,0.2)]">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full bg-[#C20013] transition-[width] duration-120 ease-out rounded-full"
                style={{ width: `${mirroredWidth}%` }}
              />
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <AudioButton
                stepType="pronunciation"
                isRecording={recorderState === "recording"}
                onClick={handleStartRecording}
              />
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-[#222] mt-1 font-primary tracking-tight">
            <span>HIGH</span>
            <span>MEDIUM</span>
            <span>LOW</span>
            <span>LOW</span>
            <span>MEDIUM</span>
            <span>HIGH</span>
          </div>
        </div>
      </LessonActionContainer>

      <LessonCTA label="NEXT" icon="►" onClick={onClick} />
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </>
  );
}
