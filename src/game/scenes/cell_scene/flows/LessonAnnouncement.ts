import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonAnnouncement extends Flow<SceneStateNames, CellScene> {
  public flowName = "LessonAnnouncement";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();

    switch (scenePhase) {
      case "before-jailer-talk":
        await runSteps([
          stepBase(() => {
            this.gameScene.noiseAnimations.clearCellNoise();
            this.gameScene.scenario.setScenarioByPerspective("jailer");
          }),
        ]);
      default:
        return {};
    }
  }

  destroy(): void {}
}
