import { LessonActions } from "@/gameUI/DreamLessonChallenges/hooks/reducers/lessonReducer";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LESSON_STATES } from "../lessonStates";

export class LessonStartState extends BaseState {
  public stateName = LESSON_STATES.BEGINNING.LESSON_START;

  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {
    console.log(`#STATE-ENTER: ${this.stateName}`);
    // TODO: Lesson Controller: setCurrentLessonEntry
    // TODO: Lesson Challenges: state: idle
    // TODO: Eliza: state: idle
    // TODO: Josef: state: idle
    // TODO: Krampus: state: idle
    // TODO: Pumpkin Kid: state: destroyed
    // TODO: Lesson Header: Show Title
  }

  exit(): void {
    console.log(`#STATE-EXIT: ${this.stateName}`);
  }

  update(): void {}

  handleInput(): void {}
}
