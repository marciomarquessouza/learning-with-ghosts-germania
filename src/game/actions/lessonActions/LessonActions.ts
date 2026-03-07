import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { Lesson } from "@/types";
import { LESSON_STATES } from "./lessonStates/lessonStates";
import { createLessonStateMachine } from "./lessonStates/createLessonStateMachine";

export class LessonActions {
  public lesson!: Lesson;
  private stateMachine!: StateMachine;
  // TODO: add Lesson Controller and a Real Score system
  private score: number = 1;

  create(scene: Phaser.Scene, lesson: Lesson) {
    this.lesson = lesson;
    this.stateMachine = createLessonStateMachine(scene, this);
  }

  update(delta: number) {
    if (this.stateMachine) {
      this.stateMachine.update(delta);
    }
  }

  destroy() {
    if (this.stateMachine) {
      this.stateMachine.clear();
    }
  }

  startLesson() {
    this.stateMachine.changeTo(LESSON_STATES.BEGINNING.LESSON_START);
  }
}

export const lessonActions = new LessonActions();
