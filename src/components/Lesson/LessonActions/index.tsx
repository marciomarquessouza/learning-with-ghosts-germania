import { useCallback, useEffect, useState } from "react";
import { useUiStore } from "@/store/uiStore";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { LessonEntry, LessonEntryStep } from "@/types";
import { StepIntroduction } from "./StepIntroduction";
import { StepPronunciation } from "./StepPronunciation";
import { StepWriting } from "./StepWriting";

export interface LessonActionsProps {
  show: boolean;
  characterDetails: CharacterDetails | null;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  nextStep: () => void;
}

export function LessonActions({
  show,
  characterDetails,
  lessonEntry,
  lessonStep,
  nextStep,
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

  if (!characterDetails || !show || !lessonStep) return null;

  return (
    <>
      {lessonStep.type === "introduction" && (
        <StepIntroduction
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickNext={handleOnClickNext}
        />
      )}
      {lessonStep.type === "pronunciation" && (
        <StepPronunciation
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickNext={handleOnClickNext}
        />
      )}
      {lessonStep.type === "writing" && (
        <StepWriting
          lessonEntry={lessonEntry}
          lessonStep={lessonStep}
          onClickNext={handleOnClickNext}
        />
      )}
    </>
  );
}
