import { BaseState } from "@/libs/game/state-machine/BaseState";
import { runSteps, stepBase } from "@/libs/game/game-flow/runSteps";
import { events } from "@/events/events";
import { getDialogueLines } from "@/store/dialogueStore";
import { DreamScene } from "..";

export class SceneIntroState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    const introDialogueLines = getDialogueLines("dream.introduction");
    const lessonDay = this.dreamScene.lessonController.getCurrentLessonDay();
    const shouldShowIntroduction =
      lessonDay === 1 && introDialogueLines.length > 0;

    runSteps([
      stepBase(() => this.dreamScene.dreamCamera.fadeIn({ duration: 800 })),
      stepBase(
        () => {
          this.dreamScene.player.enterListening();
          return events.game.async.emitAsync("dialogue/show", {
            lines: introDialogueLines,
          });
        },
        { when: () => shouldShowIntroduction },
      ),
      stepBase(() => {
        this.dreamScene.player.enterIdle();

        events.game.sync.emit("game-message/show", {
          title: "Go to Eliza",
          text: "Use the arrow keys or the A and D keys",
          closeAfter: 2_000,
        });
      }),
    ])
      .then(() => {
        this.changeTo(DreamScene.STATES.IDLE);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
