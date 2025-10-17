import { LessonEntry, LessonEntryStep } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import { LessonEntryLeft } from "./LessonEntryLeft";
import { LessonEntryRight } from "./LessonEntryRight";
import { AudioContainer } from "./AudioContainer";
import { useTimeline } from "@/hooks/useTimeline";

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
  const { isPlaying, play } = useGameAudio();
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

  const handleOnPlay = useCallback(() => {
    if (!audio) return;
    play(audio);
  }, [audio, play]);

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
      <AudioContainer
        audio={audio}
        showAudio={flags.showAudio}
        step={step}
        isPlaying={isPlaying}
        popClass={popClass}
        onClickAudio={handleOnPlay}
      />
    </div>
  );
}
