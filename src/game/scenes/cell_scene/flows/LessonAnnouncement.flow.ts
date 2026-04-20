import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";

export class LessonAnnouncement extends Flow<SceneStateNames, CellScene> {
  public flowName = "LessonAnnouncement";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();

    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(() => {
            this.gameScene.jailer.enterIdle();
            this.gameScene.noiseAnimations.clearCellNoise();
            this.gameScene.gameCamera.fadeIn({ duration: 2_000 });
            this.gameScene.scenario.setScenarioByPerspective("jailer");
            return this.delay(2_000);
          }),
          stepBase(() => {
            this.gameScene.jailer.enterInteraction();
            return events.game.async.emitAsync("dialogue/show", {
              lines: getDialogueLines("cell.marlene_first_interaction"),
            });
          }),
          stepBase(() => {
            this.gameScene.jailer.enterIdle();
            return this.delay(1_000);
          }),
          stepBase(() => {
            return this.gameScene.gameCamera.fadeOut({ duration: 1_000 });
          }),
          stepBase(() => {
            this.gameScene.setScenePhase("after-jailer-talk");
            this.gameScene.scenario.setScenarioByPerspective("cell");
            return this.gameScene.gameCamera.fadeIn({ duration: 1_000 });
          }),
        ]);

        return {
          nextState: CellScene.STATES.IDLE,
          scheduledFlows: [
            {
              id: crypto.randomUUID(),
              mode: "parallel",
              delayMs: 1_000,
              FlowClass: LessonAnnouncement,
              state: CellScene.STATES.PERFORMING_ACTION,
            },
          ],
        };
      case "after-jailer-talk":
        await runSteps([
          stepBase(() => {
            events.game.async.emitAsync("game-action-prompt/show", {
              title: "Bedtime",
              description: "It is time to sleep.",
              fixed: false,
              onAction: () => events.game.sync.emit("game-action-prompt/hide"),
            });
          }),
        ]);
        return {
          nextState: CellScene.STATES.IDLE,
        };
      default:
        return {};
    }
  }

  destroy(): void {}
}
