import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { Lesson } from "@/types";
import { LESSON_STATES } from "./lessonStates/lessonStates";
import { getNextState } from "./lessonStates/stateMap";
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
    this.stateMachine.changeTo(LESSON_STATES.LESSON.START);
  }

  next() {
    const currentState = this.stateMachine.getCurrentStateName();
    const nextState = getNextState(currentState, this.score);
    this.stateMachine.changeTo(nextState);
  }
}

export const lessonActions = new LessonActions();
