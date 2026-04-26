import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class LessonListeningFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonListeningFlow";

  private step = this.gameScene.lessonController.getStepByType("listening");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.player.enterScared();
        return this.gameScene.tutor.waitForSowing();
      }),
      stepBase(() => {
        return events.actors.learningNode.async.emitAsync(
          "sprouting:transition",
        );
      }),
      stepBase(() => {
        this.gameScene.player.enterListening();
        return events.lesson.async.emitAsync("write-lesson-description", {
          description: this.step.text,
          skipPressContinue: true,
        });
      }),
    ]);

    return {};
  }

  destroy(): void {}
}
