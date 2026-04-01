import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class DoorKnockingFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "DoorKnockingFlow";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();
    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(() => {
            this.gameScene.cameras.main.shake(200, 0.02);
            return events.game.async.emitAsync("game-action-prompt/show", {
              title: "The Jailer is Knocking the Door",
              description: "Press 'Space' or 'E' to interact",
              duration: 30,
              fixed: true,
            });
          }),
        ]);

        return {
          // TODO: replace by: nextState: "PERFORMING_ACTION" and nextAction: Lesson Announcement
        };

      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }
}
