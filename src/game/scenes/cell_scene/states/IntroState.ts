import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class IntroState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
  }

  enter(): void {
    this.cellScene.selectableAreasController.setAllDisabled(true);
    this.cellScene.noiseEffect.resetNoiseArea();

    runSteps([
      stepBase(() =>
        events.scenes.cell.async.emitAsync("show-introduction", {
          title: "Welcome to the Prison",
        }),
      ),
      stepBase(() =>
        events.game.async.emitAsync("dialogue/show", {
          lines: getDialogueLines("cell.welcome"),
        }),
      ),
    ])
      .then(() => {
        this.changeTo(CellScene.STATES.IDLE);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
        this.changeTo(CellScene.STATES.IDLE);
      });
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {}
}
