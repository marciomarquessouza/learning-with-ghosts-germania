import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { LessonAnnouncement } from "./LessonAnnouncement.flow";

export class DoorKnockingFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "DoorKnockingFlow";
  private hitCount = 0;
  private knockTimer?: Phaser.Time.TimerEvent;

  private knock() {
    this.hitCount += 1;
    this.gameScene.cameras.main.shake(200, 0.02);
    this.gameScene.audioController.playKnockOnTheDoor(this.hitCount, 3);
  }

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();

    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(async () => {
            this.knock();

            this.knockTimer = this.scene.time.addEvent({
              delay: 3_000,
              loop: true,
              callback: () => this.knock(),
            });

            events.game.async.emitAsync("game-action-prompt/show", {
              title: "The Jailer is Knocking on the Door",
              description: "Press {{key|Space}} or {{key|E}} to interact",
              durationMs: 30_000,
              fixed: true,
              onAction: () =>
                events.interactions.sync.emit("interaction/accept", {
                  id: this.flowName,
                }),
              onClose: () => this.knockTimer?.remove(),
            });
          }),
          stepBase(() =>
            this.waitInteractionEvent(() => {
              this.knockTimer?.remove();
              events.game.sync.emit("game-action-prompt/hide");
            }),
          ),
        ]);

        return {
          nextFlow: LessonAnnouncement,
          nextState: CellScene.STATES.PERFORMING_ACTION,
        };

      default:
        return {
          nextState: "SCENE_IDLE",
        };
    }
  }

  destroy(): void {}
}
