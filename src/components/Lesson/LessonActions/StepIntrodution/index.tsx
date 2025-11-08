import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonCTA } from "../common/LessonCTA";
import { useCallback, useEffect, useState } from "react";
import { useAudioPlayback } from "@/libs/audio/useAudioPlayback";
import { useTimeline } from "@/hooks/useTimeline";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { LessonEntryLeft } from "../common/LessonEntryLeft";
import { LessonEntryRight } from "../common/LessonEntryRight";
import { AudioPlaybackContainer } from "../common/AudioPlaybackContainer";
import { LessonActionContainer } from "../common/LessonActionContainer";

export interface StepIntroductionProps {
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  show: boolean;
  onClick: () => void;
}

export function StepIntroduction({
  lessonEntry,
  lessonStep,
  show,
  onClick,
}: StepIntroductionProps) {
  const [visible, setVisible] = useState(false);
  const { play, isPlaying } = useAudioPlayback();
  const { audio, reference, target } = lessonEntry;

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
    if (!audio) return;
    play(audio);
  }, [audio, play]);

  useEffect(() => {
    if (show && !visible) setVisible(true);
  }, [show, visible]);

  const isLong = reference.length > 12 || target.length > 12;

  if (!visible) return null;

  return (
    <>
      <LessonActionContainer title="Introduction">
        <LessonEntryInstruction
          audio={audio}
          instruction={lessonStep.instruction}
        />
        <div className="relative ml-8 my-1 w-[520px] grid grid-cols-2 shadow-2xl shadow-black">
          <LessonEntryLeft
            isLong={isLong}
            reference={reference}
            showReference={flags.showReference}
          />
          <LessonEntryRight
            isLong={isLong}
            target={target}
            showTarget={flags.showTarget}
          />
          {audio && (
            <AudioPlaybackContainer
              iconType="reference"
              showAudioButton={flags.showAudio}
              isPlaying={isPlaying}
              onClickAudio={handleOnPlay}
            />
          )}
        </div>
      </LessonActionContainer>
      <LessonCTA label="NEXT" icon="►" onClick={onClick} />
    </>
  );
}
