import { dreamEvents, LessonIntroductionProps } from "../dreamEvents";

export function showLessonIntroduction({
  hideAfter,
}: LessonIntroductionProps): Promise<void> {
  return new Promise((resolve) => {
    dreamEvents.emit("show-lesson-introduction", {
      hideAfter,
      afterClose: () => resolve(),
    });
  });
}
