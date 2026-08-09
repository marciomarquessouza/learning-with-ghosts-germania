import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class LessonFailureFlow extends Flow<SceneStateNames, DreamScene> {
  flowName: string = DREAM_SCENE_FLOWS.LESSON_FAILURE;
  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([stepBase(() => {})]);

    return {};
  }
  destroy(): void {}
}
