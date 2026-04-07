import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";

export class LessonAnnouncement extends Flow<SceneStateNames, CellScene> {
  public flowName = "LessonAnnouncement";

  async run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    const scenePhase = this.gameScene.getScenePhase();
    console.log("#HERE LessonAnnouncement");

    switch (scenePhase) {
      case "after-jailer-talk":
      default:
        return {};
    }
  }

  destroy(): void {}
}
