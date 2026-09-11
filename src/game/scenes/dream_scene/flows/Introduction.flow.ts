import { Flow } from "@/libs/game/game-flow/Flow";
import { DreamScene } from "..";
import { SceneStateNames } from "../constants/states";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";
import { useGameStore } from "@/store/gameStore";
import { DREAM_SCENE_FLOWS } from "../constants/flows";

export class IntroductionFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.INTRO;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => events.game.async.emitAsync("transition/cell-dream")),
      stepBase(() =>
        this.gameScene.gameCamera.fadeIn({
          duration: DreamScene.FADE_IN_DURATION,
        }),
      ),
      stepBase(() => {
        this.gameScene.player.enterListening();
        return events.game.async.emitAsync("dialogue/show", {
          lines: getDialogueLines("dream.introduction"),
        });
      }),
      stepBase(() => {
        useGameStore.getState().setMovementLocked(false);
        this.gameScene.dialogueManager.showGameActionPrompt(
          {
            title: "Go to Masked Nun",
            description:
              "Use the arrow ({{key|←}} | {{key|→}}) or the ({{key|A}} | {{key|D}}) keys",
            hideIcons: ["action"],
            fixed: false,
          },
          8_000,
        );
        this.gameScene.player.sawMovementInstructions = true;
      }),
    ]);

    return {
      nextState: DreamScene.STATES.IDLE,
    };
  }

  destroy(): void {}
}
