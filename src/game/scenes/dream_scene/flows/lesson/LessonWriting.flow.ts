import { Flow } from "@/libs/game/game-flow/Flow";
import { SceneStateNames } from "../../constants/states";
import { DreamScene } from "../..";
import { FlowResult } from "@/libs/game/game-flow/types";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";

export class LessonWritingFlow extends Flow<SceneStateNames, DreamScene> {
  public flowName: string = "LessonWritingFlow";

  private step = this.gameScene.lessonManager.getStepByType("writing");

  async run(): Promise<FlowResult<SceneStateNames, DreamScene>> {
    const hasLearningNode = this.gameScene.learningNode.floor.hasActorAttached;
    await runSteps([
      stepBase(
        async () => {
          this.gameScene.player.enterInclined();
          await this.gameScene.learningNode.resumeSproutToPumpkin();
          await this.gameScene.learningNode.increasePumpkinGrowth(0.25);
          return this.delay(800);
        },
        { when: () => !hasLearningNode },
      ),
      stepBase(() => {
        this.gameScene.player.enterListening();
        this.gameScene.learningNode.enterPumpkinIdleState();
        return this.gameScene.lessonManager.writeLessonDescription({
          dialogueTitle: "Step 3: Writing",
          description: `Follow the Masked Nun instructions`,
          hidePressContinue: true,
        });
      }),
      stepBase(() => {
        return this.gameScene.tutor.dialogue([
          "Now your challenge is to write the name of your little knowledge so it can grow even more.",
          "Connect the letters on the board to form this word.",
        ]);
      }),
      stepBase(() => {
        this.gameScene.lessonManager.startWritingChallenge({
          onClickNext: () =>
            events.interactions.sync.emit("interaction/accept"),
        });
      }),
      stepBase(() => {
        return this.waitInteractionEvent();
      }),
    ]);

    return {};
  }
  destroy(): void {}
}
