import { LessonHeaderWrapper } from "@/gameUI/components/LessonHeader/LessonHeaderWrapper";
import { useLessonHeader } from "./hooks/useLessonHeader";
import { useCharacterDetails } from "@/gameUI/hooks/useCharacterDetails";
import { NotebookToggleButton } from "@/gameUI/components/LessonHeader/NotebookToggleButton";
import { LessonExit } from "@/gameUI/components/LessonHeader/LessonExit";
import { LessonTitle } from "@/gameUI/components/LessonHeader/LessonTitle";
import { LessonDescription } from "@/gameUI/components/LessonHeader/LessonDescription";

export function DreamLessonChallenges() {
  const {
    headerState,
    clearTitle,
    onHeaderPhaseChange,
    onDescriptionPhaseChange,
  } = useLessonHeader();

  const handleOnTitleClose = () => {
    clearTitle();
  };

  const teacher = useCharacterDetails(headerState.teacher);

  return (
    <>
      <LessonHeaderWrapper
        isVisible={headerState.showHeader}
        leftIcon={<NotebookToggleButton />}
        rightIcon={<LessonExit />}
        onPhaseChange={onHeaderPhaseChange}
      >
        <LessonTitle
          isVisible={headerState.showTitle}
          title={headerState.title}
          day={headerState.day}
          onClose={handleOnTitleClose}
        />
        <LessonDescription
          isVisible={headerState.showDescription}
          dialogueTitle={headerState.dialogueTitle}
          description={headerState.description}
          hidePressContinue={headerState.skipPressContinue}
          characterDetails={teacher}
          onPhaseChange={onDescriptionPhaseChange}
        />
      </LessonHeaderWrapper>
      {/* TODO: LEsson Challenges */}
    </>
  );
}
