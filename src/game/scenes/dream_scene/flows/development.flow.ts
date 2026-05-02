import { Flow } from "@/libs/game/game-flow/Flow";
import { DreamScene } from "..";
import { SceneStateNames } from "../constants/states";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

export class DevelopmentFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = "DevelopmentFlow";

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => this.gameScene.gameCamera.fadeIn({ duration: 2_000 })),
    ]);

    return {
      nextState: DreamScene.STATES.IDLE,
    };
  }

  destroy(): void {}
}
