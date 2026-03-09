import { BaseState } from "@/libs/game/state-machine/BaseState";
import { PumpkinKids } from "../../PumpkinKids";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { PUMPKIN_STATES } from "../pumpkinStates";
import { Seed } from "../../helpers/Seed";

export class PlantPumpkinState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private pumpkinKid: PumpkinKids,
  ) {
    super(scene);
  }

  enter(): void {
    if (!this.pumpkinKid.references) {
      console.error("The references have not been initialized.");
      return;
    }

    const { groundPositionY, handPositionX, handPositionY } =
      this.pumpkinKid.references;

    const seed = new Seed(this.scene, {
      x: handPositionX,
      startY: handPositionY,
      groundY: groundPositionY,
    });

    runSteps(
      [
        stepBase(() => seed.dropSeed()),
        stepBase(() => this.pumpkinKid.sprout.sprouting()),
      ],
      {},
    ).then(() => {
      this.pumpkinKid.eventController.closeAsyncEvent("plant-pumpkin");
      this.changeTo(PUMPKIN_STATES.SPROUT_IDLE);
    });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
