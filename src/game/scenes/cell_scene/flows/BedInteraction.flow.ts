import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";
import { DreamTransition } from "./DreamTransition.flow";

export class BedInteractionFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "BedInteractionFlow";
  private selectedAlternative = "";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();
    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(() => {
            const elementBounds = this.gameScene.getElementBounds("bed");
            this.gameScene.noiseAnimations.setNoiseArea(elementBounds);
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
          stepBase(() => {
            return events.game.async.emitAsync("dialogue/show", {
              lines: getDialogueLines("cell.bed_interaction"),
              onAlternativeSelected: (alternative) => {
                this.selectedAlternative = alternative;
              },
            });
          }),
        ]);

        if (this.selectedAlternative === "dream") {
          return {
            nextState: "SCENE_TRANSITION",
            nextFlow: DreamTransition,
          };
        }
      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }

  destroy(): void {}
}
