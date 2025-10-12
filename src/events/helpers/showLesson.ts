import { LessonEvent, lessonEvents } from "../lessonEvents";

export function showLesson({ lesson, onComplete }: LessonEvent): Promise<void> {
  return new Promise((resolve) => {
    lessonEvents.emit("show-lesson", {
      lesson,
      onComplete: () => {
        onComplete?.();
        resolve();
      },
    });
  });
}
