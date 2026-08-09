import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../../constants/states";
import { DreamScene } from "../../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";
import { DREAM_SCENE_FLOWS } from "../../../constants/flows";
import { LessonIntroductionFlow } from "./LessonIntroduction.flow";

export class BeforeLessonFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = DREAM_SCENE_FLOWS.BEFORE_LESSON;

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.player.enterListening();
        this.gameScene.tutor.enterIdle();
        return events.game.async.emitAsync("dialogue/show", {
          lines: getDialogueLines("dream.lesson_preparation"),
        });
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonIntroductionFlow,
    };
  }

  destroy(): void {}
}
