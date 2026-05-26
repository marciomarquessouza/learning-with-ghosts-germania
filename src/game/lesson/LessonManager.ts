import { events } from "@/events/events";
import {
  ShowLessonTitleEvent,
  UpdateLessonDescriptionEvent,
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

  public showLessonDescription() {
    events.lesson.sync.emit("show-description");
  }

  public updateLessonDescription(
    updatedDescription: UpdateLessonDescriptionEvent,
  ) {
    events.lesson.sync.emit("update-lesson-description", updatedDescription);
  }

  public async hideLessonDescription(): Promise<void> {
    return events.lesson.async.emitAsync("hide-lesson-description");
  }

  public showVoiceIndicator() {
    events.lesson.sync.emit("show-voice-indicator");
  }

  public hideVoiceIndicator() {
    events.lesson.sync.emit("hide-voice-indicator");
  }
}
