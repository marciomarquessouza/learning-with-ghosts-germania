import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../constants/states";
import { DreamScene } from "..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { DREAM_SCENE_FLOWS } from "../constants/flows";

export class PauseFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.PAUSE;

  run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    throw new Error("Method not implemented.");
  }

  destroy(): void {}
}
