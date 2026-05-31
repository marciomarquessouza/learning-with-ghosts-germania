import { LessonHeaderWrapper } from "@/gameUI/components/LessonHeader/components/LessonHeaderWrapper";
import { useLessonHeader } from "../LessonHeader/hooks/useLessonHeader";
import { NotebookToggleButton } from "@/gameUI/components/LessonHeader/components/NotebookToggleButton";
import { LessonExit } from "@/gameUI/components/LessonHeader/components/LessonExit";
import { LessonTitle } from "@/gameUI/components/LessonHeader/components/LessonTitle";
import { StepDescription } from "@/gameUI/components/LessonHeader/components/StepDescription";
import { PronunciationVoiceIndicator } from "./components/PronunciationVoiceIndicator";
import { StepTitle } from "./components/StepTitle";

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
        isVisible={headerState.showLessonHeader}
        leftIcon={<NotebookToggleButton />}
        rightIcon={<LessonExit />}
        onPhaseChange={onHeaderPhaseChange}
      >
        <LessonTitle
          isVisible={headerState.showLessonTitle}
          title={headerState.lessonTitle}
          day={headerState.day}
          onClose={handleOnTitleClose}
        />
        <StepTitle title={headerState.dialogueTitle} />
        <StepDescription
          isVisible={headerState.showDescription}
          description={headerState.description}
          hidePressContinue={headerState.hidePressContinue}
          onPhaseChange={onDescriptionPhaseChange}
        />
        <PronunciationVoiceIndicator
          isVisible={headerState.showVoiceIndicator}
        />
      </LessonHeaderWrapper>
    </>
  );
}
