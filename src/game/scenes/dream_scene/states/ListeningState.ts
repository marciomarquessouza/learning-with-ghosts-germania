import { runSteps, stepBase } from "@/libs/game/runSteps";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { events } from "@/events/events";
import { DreamScene } from "..";

export class ListeningState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    const step = this.dreamScene.lessonController.getStepByType("listening");
    runSteps([
      stepBase(() => {
        this.dreamScene.player.enterScared();
        return this.dreamScene.tutor.waitForSowing();
      }),
      stepBase(() => {
        return events.actors.learningNode.async.emitAsync(
          "sprouting:transition",
        );
      }),
      stepBase(() => {
        this.dreamScene.player.enterListening();
        return events.lesson.async.emitAsync("write-lesson-description", {
          description: step.text,
          skipPressContinue: true,
        });
      }),
    ]);
  }

  handleInput(): void {}

  exit(): void {}

  update(): void {}
}
