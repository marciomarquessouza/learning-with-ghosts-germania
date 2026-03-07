import { LessonActions } from "@/gameUI/DreamLessonChallenges/hooks/reducers/lessonReducer";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LESSON_STATES } from "../lessonStates";

export class SowingState extends BaseState {
  public stateName = LESSON_STATES.FARMING.SOWING;
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {
    console.log(`#STATE-ENTER: ${this.stateName}`);
  }

  exit(): void {
    console.log(`#STATE-EXIT: ${this.stateName}`);
  }

  update(): void {}

  handleInput(): void {}
}
