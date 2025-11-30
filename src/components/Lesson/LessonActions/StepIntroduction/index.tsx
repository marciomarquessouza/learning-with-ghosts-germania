import { useCallback, useState } from "react";
import { LessonEntry, LessonEntryStep } from "@/types";
import { LessonCTA } from "../common/LessonCTA";
import { useAudioPlayback } from "@/libs/audio/useAudioPlayback";
import { useTimeline } from "@/hooks/useTimeline";
import { LessonEntryInstruction } from "../common/LessonEntryInstruction";
import { LessonEntryLeft } from "../common/LessonEntryLeft";
import { LessonEntryRight } from "../common/LessonEntryRight";
import { AudioPlaybackContainer } from "../common/AudioPlaybackContainer";
import { LessonActionContainer } from "../common/LessonActionContainer";
import { DialogContainer } from "../common/DialogContainer";
import { StepControls } from "./StepControls";

export interface StepIntroductionProps {
  isFirst: boolean;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  onClickNext: () => void;
  onClickPrevious: () => void;
}

export function StepIntroduction({
  isFirst,
  lessonEntry,
  lessonStep,
  onClickNext,
  onClickPrevious,
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

  const isLong = reference.length > 12 || target.length > 12;

  return (
    <DialogContainer onAnimationComplete={() => setVisible(true)}>
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
      <StepControls
        isFirst={isFirst}
        onClickPrevious={onClickPrevious}
        onClickNext={onClickNext}
      />
    </DialogContainer>
  );
}
