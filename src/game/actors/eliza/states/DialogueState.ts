import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Eliza } from "../Eliza";

export class DialogueState extends BaseState {
  constructor(
    private scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super();
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
