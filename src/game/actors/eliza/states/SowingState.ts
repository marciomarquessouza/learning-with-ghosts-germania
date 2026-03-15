import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { Eliza } from "../Eliza";

export class SowingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() =>
          this.eliza.animations.playSowing({
            onOpeningHand: () =>
              this.eliza.eventController.closeAsyncEvent("sowing"),
          }),
        ),
      ],
      {},
    )
      .then(() => {
        this.changeTo(Eliza.STATES.IDLE);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
