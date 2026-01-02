import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { VoiceLevelIndicator } from "./VoiceLevelIndicator";
import { AudioButton } from "../common/AudioButton";
import { RecorderState } from "@/libs/audio/useAudioRecorderV2";

export interface PronunciationDialogProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  recorderState: RecorderState;
  voiceLevel: number;
  onRecord: () => void;
}

export function PronunciationDialog({
  lessonEntry,
  lessonStep,
  voiceLevel,
  recorderState,
  onRecord,
}: PronunciationDialogProps) {
  return (
    <>
      <LessonEntryInstruction
        audio={lessonEntry.audio}
        instruction={lessonStep.instruction}
      />

      <VoiceLevelIndicator voiceLevel={voiceLevel}>
        <AudioButton
          type="record"
          isRecording={recorderState === "recording"}
          isLoading={recorderState === "starting"}
          onClick={onRecord}
        />
      </VoiceLevelIndicator>
      {recorderState === "starting" && (
        <p className="text-gray-600 font-mono">WAIT</p>
      )}
      {recorderState === "recording" && (
        <p className="text-gray-600 font-mono">SPEAK!</p>
      )}
    </>
  );
}
