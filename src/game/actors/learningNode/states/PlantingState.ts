import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { LearningNode } from "../LearningNode";
import { SeedAnimations } from "../animations/SeedAnimations";

export class PlantingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private learningNode: LearningNode,
  ) {
    super(scene);
  }

  enter(): void {
    if (!this.learningNode.references) {
      console.error("The references have not been initialized.");
      return;
    }

    const { groundPositionY, handPositionX, handPositionY } =
      this.learningNode.references;

    const seed = new SeedAnimations(this.scene, {
      x: handPositionX,
      startY: handPositionY,
      groundY: groundPositionY,
    });

    runSteps(
      [
        stepBase(() => seed.dropSeed()),
        stepBase(() => this.learningNode.sprout.sprouting()),
      ],
      {},
    ).then(() => {
      this.learningNode.eventController.closeAsyncEvent("plant");
      this.changeTo(LearningNode.STATES.SPROUT_IDLE);
    });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
