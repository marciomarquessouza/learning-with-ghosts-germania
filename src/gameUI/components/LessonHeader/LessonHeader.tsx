import { LessonHeaderWrapper } from "@/gameUI/components/LessonHeader/components/LessonHeaderWrapper";
import { useLessonHeader } from "../LessonHeader/hooks/useLessonHeader";
import { NotebookToggleButton } from "@/gameUI/components/LessonHeader/components/NotebookToggleButton";
import { LessonExit } from "@/gameUI/components/LessonHeader/components/LessonExit";
import { LessonTitle } from "@/gameUI/components/LessonHeader/components/LessonTitle";
import { StepDescription } from "@/gameUI/components/LessonHeader/components/StepDescription";
import { PronunciationVoiceIndicator } from "./components/PronunciationVoiceIndicator";
import { StepTitle } from "./components/StepTitle";
import { PronunciationScore } from "./components/PronunciationScore";
import { LessonLoading } from "./components/LessonLoading";

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
        <StepTitle
          isVisible={headerState.step.show}
          title={headerState.step.title}
        />
        <StepDescription
          isVisible={headerState.step.show}
          description={headerState.step.description ?? ""}
          hidePressContinue={headerState.hidePressContinue}
          onPhaseChange={onDescriptionPhaseChange}
        />
        <PronunciationVoiceIndicator
          isVisible={headerState.voiceIndicator.show}
          target={headerState.voiceIndicator.text}
        />
        <PronunciationScore
          isVisible={headerState.pronunciationScore.show}
          pronunciationResult={
            headerState.pronunciationScore.pronunciationResult
          }
        />
        <LessonLoading
          isVisible={headerState.loading.show}
          text={headerState.loading.text}
        />
      </LessonHeaderWrapper>
    </>
  );
}
