import { LessonHeaderWrapper } from "@/gameUI/components/LessonHeader/components/LessonHeaderWrapper";
import { useLessonHeader } from "../LessonHeader/hooks/useLessonHeader";
import { NotebookToggleButton } from "@/gameUI/components/LessonHeader/components/NotebookToggleButton";
import { LessonExit } from "@/gameUI/components/LessonHeader/components/LessonExit";
import { LessonTitle } from "@/gameUI/components/LessonHeader/components/LessonTitle";
import { StepDescription } from "@/gameUI/components/LessonHeader/components/StepDescription";
import { PronunciationVoiceIndicator } from "./components/PronunciationVoiceIndicator";
import { StepTitle } from "./components/StepTitle";
import { PronunciationScore } from "./components/PronunciationScore";

export function LessonHeader() {
  const {
    headerState,
    clearTitle,
    onHeaderPhaseChange,
    onDescriptionPhaseChange,
  } = useLessonHeader();

  const handleOnTitleClose = () => {
    clearTitle();
  };

  return (
    <>
      <LessonHeaderWrapper
        isVisible={headerState.showHeader}
        leftIcon={<NotebookToggleButton />}
        rightIcon={<LessonExit />}
        onPhaseChange={onHeaderPhaseChange}
      >
        <LessonTitle
          isVisible={headerState.lesson.show}
          title={headerState.lesson.title}
          day={headerState.lesson.day}
          onClose={handleOnTitleClose}
        />
        <StepTitle title={headerState.step.title} />
        <StepDescription
          isVisible={headerState.step.show}
          description={headerState.step.description ?? ""}
          hidePressContinue={headerState.hidePressContinue}
          onPhaseChange={onDescriptionPhaseChange}
        />
        <PronunciationVoiceIndicator
          isVisible={headerState.voiceIndicator.show}
        />
        <PronunciationScore
          isVisible={headerState.pronunciationScore.show}
          pronunciationResult={
            headerState.pronunciationScore.pronunciationResult
          }
        />
      </LessonHeaderWrapper>
    </>
  );
}
