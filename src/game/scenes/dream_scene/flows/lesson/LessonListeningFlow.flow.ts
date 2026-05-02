import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { AUDIO_SPEED } from "@/libs/audio/game-audio/AudioManager";

export class LessonListeningFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonListeningFlow";

  private step = this.gameScene.lessonController.getStepByType("listening");
  private target = this.gameScene.lessonController.getEntryTarget();

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    await runSteps([
      stepBase(() => {
        this.gameScene.player.enterScared();
        return this.gameScene.tutor.waitForSowing();
      }),
      stepBase(() => {
        this.gameScene.learningNode.enterSproutingState();
        return new Promise((resolve) => {
          events.actors.learningNode.sync.once("sprouting:end", () => {
            resolve();
          });
        });
      }),
      stepBase(() => {
        this.gameScene.player.enterListening();
        return events.lesson.async.emitAsync("write-lesson-description", {
          description: `${this.step.text}`,
          skipPressContinue: true,
        });
      }),
      stepBase(() => {
        this.gameScene.learningNode.attachPlayerButton(() => {
          events.interactions.sync.emit("interaction/accept", {
            id: this.flowName,
          });
        });
      }),
      this.repeatSteps(3, (index) => [
        stepBase(() => {
          return this.waitInteractionEvent();
        }),
        stepBase(async () => {
          this.gameScene.learningNode.enterSproutTalkingState();
          await this.delay(500);
          if (index === 0) {
            this.gameScene.learningNode.attachTargetLabel(this.target);
          }
          this.gameScene.learningNode.lessonTargetLabel.setBadge(
            `${index + 1}x`,
          );
          return this.gameScene.lessonController.playTargetAudio(
            AUDIO_SPEED.NORMAL,
          );
        }),
        stepBase(() => {
          this.gameScene.learningNode.enterIdleState();
        }),
      ]),
    ]);

    return {};
  }

  destroy(): void {}
}
