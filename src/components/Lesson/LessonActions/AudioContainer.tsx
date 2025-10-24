import { LessonEntryStep } from "@/types";
import { AudioButton } from "./AudioButton";

export interface AudioContainerProps {
  audio: string | undefined;
  showAudio: boolean;
  step: LessonEntryStep;
  isPlaying: boolean;
  isRecording: boolean;
  popClass: (on: boolean) => string;
  onClickAudio: () => void;
}
export function AudioContainer({
  audio,
  showAudio,
  step,
  isPlaying,
  isRecording,
  popClass,
  onClickAudio,
}: AudioContainerProps) {
  return (
    <div
      className={[
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
        popClass(showAudio),
      ].join(" ")}
    >
      {!!audio && (
        <AudioButton
          stepType={step.type}
          isPlaying={isPlaying}
          isRecording={isRecording}
          onClick={onClickAudio}
        />
      )}
    </div>
  );
}
