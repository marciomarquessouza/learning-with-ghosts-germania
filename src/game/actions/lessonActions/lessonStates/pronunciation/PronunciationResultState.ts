import { LessonActions } from "../../LessonActions";
import { BaseState } from "@/libs/game/state-machine/BaseState";

export class PronunciationResultState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
