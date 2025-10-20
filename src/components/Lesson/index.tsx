import { useEffect, useState } from "react";
import { LessonEvent, lessonEvents } from "@/events/lessonEvents";
import { useLesson } from "./hooks/useLesson";
import { LessonHeader } from "./LessonHeader";
import { LessonActions } from "./LessonActions";

function LessonContainer() {
  const {
    lessonDetails,
    lessonEntry,
    lessonStep,
    stepFlags,
    characterDetails,
    visible,
    createLesson,
    nextStep,
  } = useLesson();
  const [showActions, setShowActions] = useState(false);

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
      <LessonHeader
        show={visible}
        lessonDetails={lessonDetails}
        lessonStep={lessonStep}
        stepFlags={stepFlags}
        characterDetails={characterDetails}
      />
      <LessonActions
        show={showActions}
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
