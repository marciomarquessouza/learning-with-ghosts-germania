import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class DreamTransition extends Flow<SceneStateNames, CellScene> {
  public flowName = "DreamTransition";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();

    switch (scenePhase) {
      case "after-jailer-talk":
        runSteps([
          stepBase(() =>
            this.gameScene.gameCamera.fadeOut({ duration: 1_000 }),
          ),
          stepBase(() => {
            events.game.sync.emit("change-world/start", {
              targetWorld: "DREAM",
              targetScene: "DreamScene",
            });
          }),
        ]);

        return {};
      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }
  destroy(): void {}
}
