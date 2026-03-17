import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { Tutor } from "../Tutor";

export class SowingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private tutor: Tutor,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() =>
          this.tutor.animations.playSowing({
            onOpeningHand: () =>
              this.tutor.eventController.closeAsyncEvent("sowing"),
          }),
        ),
      ],
      {},
    )
      .then(() => {
        this.changeTo(Tutor.STATES.IDLE);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
