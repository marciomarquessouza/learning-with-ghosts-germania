import { useCallback, useEffect, useState } from "react";
import { useUiStore } from "@/store/uiStore";
import { CharacterDetails } from "@/gameUI/hooks/useCharacterDetails";
import { StepIntroduction } from "@/gameUI/components/LessonChallenges/StepIntroduction";
import { StepPronunciation } from "@/gameUI/components/LessonChallenges/StepPronunciation";
import { StepWriting } from "@/gameUI/components/LessonChallenges/StepWriting";
import { LessonEntry, LessonEntryStep } from "@/libs/lesson/types";

export interface LessonControllerProps {
  show: boolean;
  isFirst: boolean;
  isLast: boolean;
  characterDetails: CharacterDetails | null;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  nextStep: () => void;
  previousStep: () => void;
}

export function LessonController({
  isFirst,
  isLast,
  show,
  characterDetails,
  lessonEntry,
  lessonStep,
  nextStep,
  previousStep,
}: LessonControllerProps) {
  const [visible, setVisible] = useState(false);
  const { setInteractionDialogueOpen } = useUiStore();

  useEffect(() => {
    if (show && !visible) {
      setVisible(show);
    }
  }, [visible, show, lessonStep?.instruction]);

  useEffect(() => {
    setInteractionDialogueOpen(visible);
  }, [visible, setInteractionDialogueOpen]);

  const handleOnClickNext = useCallback(() => {
    nextStep();
    setVisible(false);
  }, [nextStep]);

  const handleOnClickPrevious = useCallback(() => {
    previousStep();
    setVisible(false);
  }, [previousStep]);

  if (!characterDetails || !show || !lessonStep) return null;

  return (
    <>
      {lessonStep.type === "introduction" && (
        <StepIntroduction
          isFirst={isFirst}
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickPrevious={handleOnClickPrevious}
          onClickNext={handleOnClickNext}
        />
      )}
      {lessonStep.type === "pronunciation" && (
        <StepPronunciation
          show
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickPrevious={handleOnClickPrevious}
          onClickNext={handleOnClickNext}
        />
      )}
      {lessonStep.type === "writing" && (
        <StepWriting
          isLast={isLast}
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickNext={handleOnClickNext}
          onClickPrevious={handleOnClickPrevious}
        />
      )}
    </>
  );
}
