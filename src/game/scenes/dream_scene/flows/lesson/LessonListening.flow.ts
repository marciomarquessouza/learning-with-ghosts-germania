import { events } from "@/events/events";
import { Flow } from "@/libs/game/game-flow/Flow";
import { FlowResult } from "@/libs/game/game-flow/types";
import { AUDIO_SPEED } from "@/libs/audio/game-audio/AudioManager";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";

import { DreamScene } from "../..";
import { SceneStateNames } from "../../constants/states";
import { LessonPronunciation } from "./LessonPronunciation.flow";

const LISTENING_REPETITION = 3;

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
      this.repeatSteps(LISTENING_REPETITION, (index) => [
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
          this.gameScene.learningNode.increaseSize();
          this.gameScene.learningNode.enterIdleState();
        }),
      ]),
      stepBase(() => {
        this.gameScene.learningNode.detachTargetLabel();
        this.gameScene.learningNode.detachPlayerButton();
      }),
    ]);

    return {
      nextState: DreamScene.STATES.PERFORMING_LESSON,
      nextFlow: LessonPronunciation,
    };
  }

  destroy(): void {}
}
