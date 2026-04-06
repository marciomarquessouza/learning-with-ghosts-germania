import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class DoorKnockingFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "DoorKnockingFlow";

  private knockTimer?: Phaser.Time.TimerEvent;

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

            try {
              knock();

              this.knockTimer = this.scene.time.addEvent({
                delay: 3_000,
                loop: true,
                callback: knock,
              });

              await events.game.async.emitAsync("game-action-prompt/show", {
                title: "The Jailer is Knocking on the Door",
                description: "Press {{key|Space}} or {{key|E}} to interact",
                durationMs: 30_000,
                fixed: true,
                onClose: () => {
                  this.knockTimer?.remove();
                  this.knockTimer = undefined;
                },
              });
            } finally {
              this.knockTimer?.remove();
              this.knockTimer = undefined;
            }
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

  destroy(): void {
    this.knockTimer?.remove();
    this.knockTimer = undefined;
  }
}
