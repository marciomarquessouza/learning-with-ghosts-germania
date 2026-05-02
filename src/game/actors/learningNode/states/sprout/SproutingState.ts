import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { LearningNode } from "../../LearningNode";
import { SeedAnimations } from "../../animations/SeedAnimations";
import { events } from "@/events/events";

export class SproutingState extends BaseState {
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
        stepBase(() => this.learningNode.animations.playSproutTransition()),
      ],
      {},
    )
      .then(() => {
        events.actors.learningNode.sync.emit("sprouting:end");
        this.learningNode.animations.playSproutIdle();
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  handleInput(): void {}

  update(): void {}
}
