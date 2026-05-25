import { Flow } from "@/libs/game/game-flow/Flow";
import { DreamScene } from "..";
import { SceneStateNames } from "../constants/states";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class IntroductionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = "IntroductionFlow";

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => events.game.async.emitAsync("transition/cell-dream")),
      stepBase(() => this.gameScene.gameCamera.fadeIn({ duration: 2_000 })),
      stepBase(() => {
        this.gameScene.player.enterListening();
        return events.game.async.emitAsync("dialogue/show", {
          lines: getDialogueLines("dream.introduction"),
        });
      }),
      stepBase(() => {
        this.gameScene.dialogueManager.showGameMessage({
          title: "Go to Eliza",
          text: "Use the arrow keys or the A and D keys",
          closeAfter: 8_000,
        });
      }),
    ]);

    return {
      nextState: DreamScene.STATES.IDLE,
    };
  }

  destroy(): void {}
}
