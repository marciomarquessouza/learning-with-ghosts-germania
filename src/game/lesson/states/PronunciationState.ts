import { LessonController } from "../LessonController";
import { BaseState } from "@/libs/game/state-machine/BaseState";

export class PronunciationState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonController: LessonController,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
