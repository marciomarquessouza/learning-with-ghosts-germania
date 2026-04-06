import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class BedInteractionFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "BedInteractionFlow";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();
    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(() => {
            const elementBounds = this.gameScene.getElementBounds("bed");
            this.gameScene.noiseEffect.setNoiseArea(elementBounds);
            events.game.async.emitAsync("dialogue/show", {
              lines: getDialogueLines("cell.bed_blocked"),
            });
          }),
        ]);

        return {
          nextState: "SCENE_IDLE",
        };

      case "after-jailer-talk":
        await runSteps([
          stepBase(() =>
            events.game.async.emitAsync("dialogue/show", {
              lines: getDialogueLines("cell.bed_interaction"),
            }),
          ),
        ]);

        return {
          nextState: "SCENE_IDLE",
        };

      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }

  destroy(): void {}
}
