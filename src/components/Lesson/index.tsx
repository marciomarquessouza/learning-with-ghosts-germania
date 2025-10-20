import { useEffect } from "react";
import { LessonDialog } from "./LessonDialog";
import { LessonHeader } from "./LessonHeader";
import { LessonEvent, lessonEvents } from "@/events/lessonEvents";
import { useLesson } from "./hooks/useLesson";

function LessonContainer() {
  const {
    displayedText,
    lessonEntry,
    lessonStep,
    characterDetails,
    isTypingComplete,
    visible,
    createLesson,
    nextStep,
    startTyping,
    handleTextClick,
  } = useLesson();

  useEffect(() => {
    const handler = (payload: LessonEvent) => {
      const { lesson } = payload;
      const onComplete = () => {
        payload?.onComplete?.();
        lessonEvents.emit("hide-lesson", { lessonId: lesson.id });
      };
      createLesson(lesson, onComplete);
    };

    lessonEvents.on("show-lesson", handler);
    return () => lessonEvents.off("show-lesson", handler);
  }, [createLesson]);

  return (
    <>
      <LessonHeader show={true} />
      <LessonDialog
        show={true}
        characterDetails={characterDetails}
        stepDescription="Teste"
        lessonEntry={lessonEntry}
        lessonStep={lessonStep}
        nextStep={nextStep}
      />
    </>
  );
}

export default LessonContainer;
