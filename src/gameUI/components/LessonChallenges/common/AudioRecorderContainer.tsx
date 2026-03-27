import { popClass } from "@/utils/popClass";
import { RefObject } from "react";

export interface AudioRecorderContainerProps {
  audioRecordRef: RefObject<HTMLAudioElement | null>;
  showAudioButton: boolean;
  isRecording: boolean;
  onClickAudio: () => void;
}

// TODO: update audio recorder container
export function AudioRecorderContainer({
  audioRecordRef,
  showAudioButton,
  isRecording,
  onClickAudio,
}: AudioRecorderContainerProps) {
  return (
    <div
      className={[
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
        popClass(showAudioButton),
      ].join(" ")}
    >
      {/* <AudioButton
		stepType={step.type}
		isPlaying={isPlaying}
		isRecording={isRecording}
		onClick={onClickAudio}
	  /> */}
      {/* Audio Motor: audio element for audio recorded playback. Should not be visible */}
      <audio ref={audioRecordRef} preload="metadata" className="hidden" />
    </div>
  );
}
