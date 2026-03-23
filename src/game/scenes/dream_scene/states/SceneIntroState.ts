import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { DreamScene } from "..";
import { events } from "@/events/events";
import { stepGameMessage, stepShowDialogue } from "@/game/actions/stepActions";
import { useDialoguesStore } from "@/store/dialogueStore";

export class SceneIntroState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    const dialogueIntroduction =
      useDialoguesStore.getState().dialogues["dream.introduction"];

    runSteps(
      [
        stepShowDialogue({ lines: dialogueIntroduction.lines }),
        stepGameMessage({
          title: "Go to Eliza",
          text: "Use the arrow keys or the A and D keys",
        }),
      ],
      {},
    )
      .then(() => {})
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
