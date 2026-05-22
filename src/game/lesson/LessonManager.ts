import { events } from "@/events/events";
import {
  ShowLessonTitleEvent,
  WriteLessonDescriptionEvent,
} from "@/events/lesson/types";
import { LessonController } from "@/libs/lesson/LessonController";
import { Lesson } from "@/libs/lesson/types";

export class LessonManager extends LessonController {
  constructor(lesson: Lesson) {
    super(lesson);
  }

  public async showLessonTitle(
    lessonTitleContent: ShowLessonTitleEvent,
  ): Promise<void> {
    return events.lesson.async.emitAsync(
      "show-lesson-title",
      lessonTitleContent,
    );
  }

  public async hideLessonTitle(): Promise<void> {
    return events.lesson.async.emitAsync("hide-lesson-title");
  }

  public async writeLessonDescription(
    lessonDescription: WriteLessonDescriptionEvent,
  ): Promise<void> {
    return events.lesson.async.emitAsync(
      "write-lesson-description",
      lessonDescription,
    );
  }
}
