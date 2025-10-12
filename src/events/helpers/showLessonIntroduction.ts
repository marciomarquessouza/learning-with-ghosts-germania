import { lessonEvents, LessonIntroductionProps } from "../lessonEvents";

export function showLessonIntroduction({
  onVisible,
}: LessonIntroductionProps): Promise<void> {
  return new Promise((resolve) => {
    lessonEvents.emit("show-lesson-introduction", {
      onVisible: () => {
        onVisible?.();
        resolve();
      },
    });
  });
}
