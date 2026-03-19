import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LessonController } from "../LessonController";

export class WritingState extends BaseState {
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
