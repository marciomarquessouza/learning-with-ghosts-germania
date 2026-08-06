import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { WritingResult } from "@/events/lesson/types";
import { DREAM_SCENE_FLOWS } from "../../constants/flows";
import { LessonSuccessFlow } from "./LessonSuccess.flow";
import { LessonFailureFlow } from "./LessonFailure.flow";

export class LessonWritingFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = DREAM_SCENE_FLOWS.LESSON_WRITING;

  private writingResult?: WritingResult;
  private isAudioSamplePlaying = false;
  private removePlayTargetAudioEvent: () => void = () => {};
  private target = this.gameScene.lessonManager.getEntryTarget();
  private lessonEntry = this.gameScene.lessonManager.getCurrentLessonEntry();

  private get hasWon(): boolean {
    return !!this.writingResult?.success;
  }

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        async () => {
          this.gameScene.createLearningNode();
          // TODO: add Knowledge Troop
          this.gameScene.player.enterInclined();
          const sequence = this.lessonEntry.sequence + 1;
          await this.gameScene.learningNode.resumeSproutToPumpkin({
            sequence,
            target: this.target,
            offsetY: -130,
          });
          await this.gameScene.learningNode.increasePumpkinGrowth(0.25);
          return this.delay(800);
        },
        { when: () => !hasLearningNode },
      ),
      stepBase(() => {
        this.removePlayTargetAudioEvent = events.audio.sync.on(
          "audio:play-sample",
          async () => {
            if (this.isAudioSamplePlaying) return;
            this.isAudioSamplePlaying = true;
            await this.gameScene.lessonManager.playTargetAudio();
            this.isAudioSamplePlaying = false;
          },
        );
      }),
      stepBase(() => {
        this.gameScene.player.enterListening();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 3: Writing",
          description: `Follow the Masked Nun instructions`,
        });
      }),
      stepBase(() => {
        return this.gameScene.tutor.dialogue([
          "Now your challenge is to write the name of your little knowledge...",
          "...so it can grow even more.",
          "Connect the letters on the board to form this word.",
        ]);
      }),
      stepBase(() => {
        this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 3: Writing",
          description: `Connect the letters on the board to form this word.`,
        });
        return this.gameScene.lessonManager.startWritingChallenge({
          limits: { totalTips: 3, totalErrors: 3 },
          onClickNext: (result) => {
            this.writingResult = result;
          },
        });
      }),
      stepBase(async () => {
        await this.delay(1_000);
        this.gameScene.learningNode.enterFullIdleState();
        return this.gameScene.learningNode.increasePumpkinGrowth(0.75);
      }),
    ]);

    return this.hasWon
      ? {
          nextState: DreamScene.STATES.PERFORMING_LESSON,
          nextFlow: LessonSuccessFlow,
        }
      : {
          nextState: DreamScene.STATES.PERFORMING_LESSON,
          nextFlow: LessonFailureFlow,
        };
  }
  destroy(): void {
    this.removePlayTargetAudioEvent();
  }
}
