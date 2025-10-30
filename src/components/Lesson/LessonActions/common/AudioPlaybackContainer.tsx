import { LessonStepType } from "@/types";
import { AudioButton } from "./AudioButton";
import { popClass } from "../../../../utils/popClass";

export interface AudioPlaybackContainerProps {
  showAudioButton: boolean;
  stepType: LessonStepType;
  isPlaying: boolean;
  onClickAudio: () => void;
}
export function AudioPlaybackContainer({
  showAudioButton,
  stepType,
  isPlaying,
  onClickAudio,
}: AudioPlaybackContainerProps) {
  return (
    <div
      className={[
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
        popClass(showAudioButton),
      ].join(" ")}
    >
      <AudioButton
        stepType={stepType}
        isPlaying={isPlaying}
        onClick={onClickAudio}
      />
    </div>
  );
}
