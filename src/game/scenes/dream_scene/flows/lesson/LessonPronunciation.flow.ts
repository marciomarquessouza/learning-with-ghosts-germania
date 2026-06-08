import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class LessonPronunciationFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName = "LessonPronunciationFlow";

  private target = this.gameScene.lessonManager.getEntryTarget();
  private step = this.gameScene.lessonManager.getStepByType("pronunciation");
  private isAudioSamplePlaying = false;
  private removePlayAudioEvent: () => void = () => {};

  private recordId = "";

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasActorAttached = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        () => {
          this.gameScene.player.enterInclined();
          return this.gameScene.learningNode.resumeSproutToPumpkin();
        },
        { when: () => !hasActorAttached },
      ),
      stepBase(() => {
        this.gameScene.player.enterListening();
        this.gameScene.learningNode.enterPumpkinIdleState();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: `Follow the Masked Nun instructions`,
          hidePressContinue: true,
        });
      }),
      stepBase(() => {
        this.gameScene.tutor.enterTeaching();
        return this.gameScene.tutor.dialogue([
          "Very good, let's now move on to pronunciation.",
          `Click the record button and say "${this.target}" out loud.
          ${this.step.text}`,
        ]);
      }),
      stepBase(() => {
        this.gameScene.tutor.enterIdle();
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 2: Pronunciation",
          description: this.step.instruction,
          hidePressContinue: true,
        });
        this.removePlayAudioEvent = events.audio.sync.on(
          "audio:play-sample",
          async () => {
            if (this.isAudioSamplePlaying) return;
            this.isAudioSamplePlaying = true;
            await this.gameScene.lessonManager.playTargetAudio();
            this.isAudioSamplePlaying = false;
          },
        );
        this.gameScene.player.attachRecordButton({
          onStartRecord: async () => {
            await this.gameScene.lessonManager.hideLessonDescription();
            const { recordId } =
              await this.gameScene.lessonManager.pronunciationChallenge();
            this.recordId = recordId;
          },
          onStopRecord: () => {
            this.gameScene.lessonManager.hideVoiceIndicator();
            this.gameScene.lessonManager.stopPronunciationChallenge();
          },
        });
      }),
      stepBase(() => {
        return this.waitInteractionEvent(async () => {
          const { recordId } =
            await this.gameScene.lessonManager.pronunciationChallenge();
          this.recordId = recordId;
        });
      }),
    ]);

    return {};
  }

  destroy(): void {
    this.removePlayAudioEvent();
  }
}
