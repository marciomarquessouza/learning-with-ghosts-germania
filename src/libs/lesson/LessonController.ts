import { Lesson, LessonEntry, LessonStepType } from "./types";

export class LessonController {
  private nextEntries: LessonEntry[] = [];
  public currentLessonEntry: LessonEntry | null = null;
  public lesson: Lesson;

  constructor(lesson: Lesson) {
    this.lesson = lesson;
    this.nextEntries = [...this.lesson.entries];
  }

  public setCurrentLessonEntry() {
    if (this.hasNextEntry()) {
      const [entry, ...nextEntries] = this.nextEntries;
      this.currentLessonEntry = entry;
      this.nextEntries = nextEntries;
    }
  }

  public getStepByType(stepType: LessonStepType) {
    const step = this.currentLessonEntry?.steps.find(
      ({ type }) => stepType === type,
    );

    if (!step) {
      throw new Error(
        `Step not found: Lesson ${this.lesson.title} | Entry: ${this.currentLessonEntry?.id}`,
      );
    }

    return step;
  }

  public hasNextEntry() {
    return this.nextEntries.length > 0;
  }
}
