import { BaseState } from "@/libs/game/state-machine/BaseState";
import { LearningNode } from "../../LearningNode";

export class FullWalkingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    this.learningNode.animations.setVisible(true);
    if (this.learningNode.isEvil()) {
      this.learningNode.animations.playEvilWalking();
    } else {
      this.learningNode.animations.playFullWalking();
    }
  }

  exit(): void {}

  handleInput(): void {}

  update(): void {}
}
