import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { Lesson, LessonEntry, LessonStepType } from "@/types";
import { LESSON_STATES } from "./constants/states";
import { createLessonStateMachine } from "./helpers/createLessonStateMachine";

export class LessonActions {
  public static readonly STATES = LESSON_STATES;

  public lesson!: Lesson;
  private stateMachine!: StateMachine;
  public currentLessonEntry: LessonEntry | null = null;
  private nextEntries: LessonEntry[] = [];

  create(scene: Phaser.Scene, lesson: Lesson) {
    this.lesson = lesson;
    this.stateMachine = createLessonStateMachine(scene, this);
    this.nextEntries = [...lesson.entries];
  }

  update(delta: number) {
    this.stateMachine?.update(delta);
  }

  startLesson() {
    this.stateMachine.changeTo(LessonActions.STATES.LESSON_START);
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

  destroy() {
    if (this.stateMachine) {
      this.stateMachine.clear();
    }
  }
}

export const lessonActions = new LessonActions();
