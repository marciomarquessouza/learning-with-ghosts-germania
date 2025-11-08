import { AudioButton, AudioButtonTypes } from "./AudioButton";
import { popClass } from "../../../../utils/popClass";

export interface AudioPlaybackContainerProps {
  showAudioButton: boolean;
  iconType: AudioButtonTypes;
  isPlaying: boolean;
  onClickAudio: () => void;
}
export function AudioPlaybackContainer({
  showAudioButton,
  iconType,
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
        type={iconType}
        isPlaying={isPlaying}
        onClick={onClickAudio}
      />
    </div>
  );
}
