import { RefObject } from "react";
import { LessonEntryStep } from "@/types";
import { AudioButton } from "./AudioButton";

export interface AudioContainerProps {
  audioRecordRef: RefObject<HTMLAudioElement | null>;
  showAudioButton: boolean;
  step: LessonEntryStep;
  isPlaying: boolean;
  isRecording: boolean;
  popClass: (on: boolean) => string;
  onClickAudio: () => void;
}
export function AudioContainer({
  audioRecordRef,
  showAudioButton,
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
        popClass(showAudioButton),
      ].join(" ")}
    >
      <AudioButton
        stepType={step.type}
        isPlaying={isPlaying}
        isRecording={isRecording}
        onClick={onClickAudio}
      />
      {/* Audio Motor: audio element for audio recorded playback. Should not be visible */}
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </div>
  );
}
