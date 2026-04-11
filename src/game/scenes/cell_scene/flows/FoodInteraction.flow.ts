import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class FoodInteractionFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "FoodInteractionFlow";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();

    switch (scenePhase) {
      default:
        await runSteps([
          stepBase(() => {
            const elementBounds = this.gameScene.getElementBounds("food");
            this.gameScene.noiseAnimations.setNoiseArea(elementBounds);
            events.game.async.emitAsync("dialogue/show", {
              lines: getDialogueLines("cell.food_blocked"),
            });
          }),
        ]);

        return {
          nextState: "SCENE_IDLE",
        };
    }
  }

  destroy(): void {}
}
