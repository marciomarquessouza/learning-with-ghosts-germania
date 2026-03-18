import { LessonManager } from "../LessonManager";
import { BaseState } from "@/libs/game/state-machine/BaseState";

export class WritingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonManager: LessonManager,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
