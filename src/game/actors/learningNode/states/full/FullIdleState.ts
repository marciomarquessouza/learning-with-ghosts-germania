import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LearningNode } from "../../LearningNode";

export class FullIdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    this.learningNode.animations.setVisible(true);
    if (this.learningNode.isEvil()) {
      this.learningNode.animations.playEvilIdle();
    } else {
      this.learningNode.animations.playOutIdle();
    }
  }

  exit(): void {}

  handleInput(): void {}

  update(): void {}
}
