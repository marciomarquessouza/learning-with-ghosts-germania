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
  private removePlayAudioEvents: (() => void)[] = [];

  private async startPronunciationChallenge() {
    const pronunciationResult =
      await this.gameScene.lessonManager.pronunciationChallenge();
    this.removePlayAudioEvents.push(
      events.lesson.sync.on("action-button:reproduce-audio", () => {
        this.gameScene.lessonManager.playPronunciationRecord(
          pronunciationResult.recordId,
        );
      }),
    );
    this.gameScene.player.detachRecordButton();
    this.gameScene.lessonManager.showPronunciationScore(pronunciationResult);
  }

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
        this.removePlayAudioEvents.push(
          events.audio.sync.on("audio:play-sample", async () => {
            if (this.isAudioSamplePlaying) return;
            this.isAudioSamplePlaying = true;
            await this.gameScene.lessonManager.playTargetAudio();
            this.isAudioSamplePlaying = false;
          }),
        );
      }),
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
          `Click the mic or click {{key|space}} and say: “{{target|${this.target}}}”.
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
        this.gameScene.player.attachRecordButton({
          onStartRecord: async () => {
            events.interactions.sync.emit("interaction/accept", {
              id: this.flowName,
            });
          },
          onStopRecord: () => {
            this.gameScene.lessonManager.hideVoiceIndicator();
            this.gameScene.lessonManager.stopPronunciationChallenge();
          },
        });
      }),
      stepBase(() => {
        return this.waitInteractionEvent(async () => {
          await this.gameScene.lessonManager.hideLessonDescription();
          await this.startPronunciationChallenge();
        });
      }),
    ]);

    return {};
  }

  destroy(): void {
    this.removePlayAudioEvents.forEach((removeEvent) => removeEvent());
  }
}
