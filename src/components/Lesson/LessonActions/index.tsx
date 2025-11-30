import { useCallback, useEffect, useState } from "react";
import { useUiStore } from "@/store/uiStore";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { LessonEntry, LessonEntryStep } from "@/types";
import { StepIntroduction } from "./StepIntroduction";
import { StepPronunciation } from "./StepPronunciation";
import { StepWriting } from "./StepWriting";

export interface LessonActionsProps {
  show: boolean;
  isFirst: boolean;
  characterDetails: CharacterDetails | null;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  nextStep: () => void;
  previousStep: () => void;
}

export function LessonActions({
  isFirst,
  show,
  characterDetails,
  lessonEntry,
  lessonStep,
  nextStep,
  previousStep,
}: LessonActionsProps) {
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
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickPrevious={handleOnClickPrevious}
          onClickNext={handleOnClickNext}
        />
      )}
      {lessonStep.type === "writing" && (
        <StepWriting
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickNext={handleOnClickNext}
          onClickPrevious={handleOnClickPrevious}
        />
      )}
    </>
  );
}
