import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonSuccessFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.LESSON_SUCCESS;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([stepBase(() => {})]);

    return {};
  }

  destroy(): void {}
}
