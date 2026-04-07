import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { LessonAnnouncement } from "./LessonAnnouncement";

export class DoorKnockingFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "DoorKnockingFlow";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();

    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(async () => {
            let hitCount = 0;

            const knock = () => {
              hitCount += 1;
              this.gameScene.cameras.main.shake(200, 0.02);
              this.gameScene.audioController.playKnockOnTheDoor(hitCount, 3);
            };

            knock();

            const knockTimer = this.scene.time.addEvent({
              delay: 3_000,
              loop: true,
              callback: knock,
            });

            events.game.async.emitAsync("game-action-prompt/show", {
              title: "The Jailer is Knocking on the Door",
              description: "Press {{key|Space}} or {{key|E}} to interact",
              durationMs: 30_000,
              fixed: true,
              onAction: () => this.gameScene.runNextAction(LessonAnnouncement),
              onClose: () => knockTimer.remove(),
            });
          }),
        ]);

        return {
          nextFlow: LessonAnnouncement,
          nextState: CellScene.STATES.PERFORMING_ACTION,
          waitInputToContinue: true,
        };

      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }

  destroy(): void {}
}
