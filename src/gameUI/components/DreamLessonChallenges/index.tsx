import { LessonHeaderWrapper } from "@/gameUI/components/LessonHeader/LessonHeaderWrapper";
import { useLessonHeader } from "./hooks/useLessonHeader";
import { NotebookToggleButton } from "@/gameUI/components/LessonHeader/NotebookToggleButton";
import { LessonExit } from "@/gameUI/components/LessonHeader/LessonExit";
import { LessonTitle } from "@/gameUI/components/LessonHeader/LessonTitle";
import { LessonDescription } from "@/gameUI/components/LessonHeader/LessonDescription";
import { PronunciationVoiceIndicator } from "../LessonHeader/PronunciationVoiceIndicator";

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
        <div id="dialogue-title" className="flex w-full flex-col items-center">
          <div className="my-2 bg-[#FFF3E4] px-4 py-0">
            <p className="font-primary text-left text-lg font-semibold tracking-wide text-black">
              {headerState.dialogueTitle}
            </p>
          </div>
        </div>
        <LessonDescription
          isVisible={headerState.showDescription}
          description={headerState.description}
          hidePressContinue={headerState.hidePressContinue}
          onPhaseChange={onDescriptionPhaseChange}
        />
        <PronunciationVoiceIndicator
          isVisible={headerState.showVoiceIndicator}
          voiceLevel={0.1}
        />
      </LessonHeaderWrapper>
    </>
  );
}
