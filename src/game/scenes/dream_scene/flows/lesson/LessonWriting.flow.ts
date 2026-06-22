import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";

export class LessonWritingFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = "LessonWritingFlow";

  private step = this.gameScene.lessonManager.getStepByType("writing");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    throw new Error("Method not implemented.");
  }
  destroy(): void {
    throw new Error("Method not implemented.");
  }
}
