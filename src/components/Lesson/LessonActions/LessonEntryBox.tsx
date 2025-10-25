import { LessonEntry, LessonEntryStep } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { LessonEntryLeft } from "./LessonEntryLeft";
import { LessonEntryRight } from "./LessonEntryRight";
import { AudioContainer } from "./AudioContainer";
import { useTimeline } from "@/hooks/useTimeline";
import { LessonEntryInstruction } from "./LessonEntryInstruction";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

type LessonEntryBoxProps = Omit<LessonEntry, "steps"> & {
  step: LessonEntryStep;
  isTypingComplete: boolean;
};

export function LessonEntryBox({
  reference,
  target,
  isTypingComplete,
  step,
  audio,
}: LessonEntryBoxProps) {
  const [visible, setVisible] = useState(false);
  const { play, isPlaying } = useAudioPlayback();
  const {
    audioRecordRef,
    startRecording,
    stopRecording,
    playRecord,
    recorderState,
  } = useAudioRecorder();
  const flags = useTimeline({
    lines: [
      {
        key: "showReference",
        time: 40,
      },
      {
        key: "showTarget",
        time: 180,
      },
      {
        key: "showAudio",
        time: 320,
      },
      {
        key: "playAudio",
        time: 420,
        callback: () => !!audio && play(audio),
      },
    ],
    started: visible,
  });

  const handleOnPlay = useCallback(async () => {
    if (step.type === "pronunciation") {
      if (recorderState === "idle") {
        startRecording();
      }
      if (recorderState === "recording") {
        stopRecording();
      }
    } else {
      if (!audio) return;
      play(audio);
    }
  }, [audio, play, startRecording, recorderState, stopRecording, step.type]);

  const isLong = reference.length > 12 || target.length > 12;

  useEffect(() => {
    if (isTypingComplete) setVisible(true);
  }, [isTypingComplete]);

  if (!visible) return null;

  const popClass = (on: boolean) =>
    [
      "transition-all duration-200 ease-out will-change-transform",
      on
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-95 translate-y-1",
    ].join(" ");

  return (
    <div
      className={[
        "flex w-full flex-col justify-start items-center",
        "mt-2 bg-[rgba(245,245,245,0.5)] px-2 pt-0 pb-2",
        "outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto",
      ].join(" ")}
    >
      <LessonEntryInstruction audio={audio} instruction={step.instruction} />
      <div className="relative ml-8 my-1 w-[520px] grid grid-cols-2 shadow-2xl shadow-black">
        <LessonEntryLeft
          isLong={isLong}
          reference={reference}
          showReference={flags.showReference}
          popClass={popClass}
        />
        <LessonEntryRight
          isLong={isLong}
          target={target}
          showTarget={flags.showTarget}
          popClass={popClass}
        />
        {audio && (
          <AudioContainer
            audioRecordRef={audioRecordRef}
            showAudioButton={flags.showAudio}
            step={step}
            isPlaying={isPlaying}
            isRecording={recorderState === "recording"}
            popClass={popClass}
            onClickAudio={handleOnPlay}
          />
        )}
      </div>
    </div>
  );
}
