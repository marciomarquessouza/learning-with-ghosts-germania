import { BaseState } from "@/libs/game/state-machine/BaseState";
import { PumpkinKids } from "../../PumpkinKids";

export class SproutIdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private pumpkin: PumpkinKids,
  ) {
    super(scene);
  }
  enter(): void {
    this.pumpkin.sprout.idle();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
