import { FlowResult } from "@/libs/game/game-flow/types";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { LessonNextEntryFlow } from "../lesson/0-introduction/LessonNextEntry.flow";

export async function afterChallengeCondition(
  gameScene: DreamScene,
): Promise<FlowResult<SceneStateNames, DreamScene>> {
  if (gameScene.lessonManager.callNextEntry()) {
    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonNextEntryFlow,
    };
  }

  return {};
}
