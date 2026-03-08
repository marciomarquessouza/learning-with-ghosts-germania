import { LessonTitle } from "../LessonHeader/LessonTitle";
import { useLessonHeader } from "./hooks/useLessonHeader";
import { LessonHeaderWrapper } from "../LessonHeader/LessonHeaderWrapper";
import { NotebookToggleButton } from "../LessonHeader/NotebookToggleButton";
import { LessonExit } from "../LessonHeader/LessonExit";
import { LessonDescription } from "../LessonHeader/LessonDescription";
import { useCharacterDetails } from "@/hooks/useCharacterDetails";

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
          description={headerState.description}
          characterDetails={teacher}
          onPhaseChange={onDescriptionPhaseChange}
        />
      </LessonHeaderWrapper>
      {/* TODO: LEsson Challenges */}
    </>
  );
}
