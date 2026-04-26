import { Flow } from "@/libs/game/game-flow/Flow";
import { CellScene } from "..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";
import { SceneStateNames } from "../constants/states";
import { DoorKnockingFlow } from "./DoorKnocking.flow";

export class IntroductionFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "IntroductionFlow";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();
    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
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
        ]);

        return {
          nextState: "SCENE_IDLE",
          scheduledFlows: [
            {
              id: crypto.randomUUID(),
              delayMs: 2_000,
              FlowClass: DoorKnockingFlow,
              mode: "queue",
            },
          ],
        };

      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }

  destroy(): void {}
}
