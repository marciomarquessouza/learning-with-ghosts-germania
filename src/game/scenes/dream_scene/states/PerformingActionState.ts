import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { events } from "@/events/events";
import { createInputController } from "@/libs/inputs/createInputController";
import { InputController } from "@/libs/inputs/InputController";

export class PerformingActionState extends BaseState {
  private input: InputController;

  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
    this.input = createInputController(this.scene);
  }

  enter(): void {
    events.game.sync.emit("game-action-prompt/hide");
    events.game.sync.emit("dialogue/hide");

    const lastState = this.stateMachine.getPreviousStateName();

    if (lastState === DreamScene.STATES.PERFORMING_LESSON) {
      this.lessonConclusion();
    }

    if (!this.dreamScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    try {
      const flow = this.dreamScene.flowController.getNextFlow();

      if (!flow) {
        throw new Error("Flow not found");
      }

      this.dreamScene.flowController.clearNextFlow();

      this.dreamScene.flowController.run(flow).then(({ nextState }) => {
        if (nextState) {
          this.changeTo(nextState);
        }
      });
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.dreamScene.flowController.clearNextFlow();
      this.changeTo(DreamScene.STATES.IDLE);
    }
  }

  private async lessonConclusion() {
    const playerSprite = this.dreamScene.player.sprite;
    this.dreamScene.gameCamera.centerOnTarget(playerSprite);
    this.dreamScene.gameCamera.zoomTo({
      zoom: 1,
      duration: 1_000,
    });
    await events.lesson.async.emitAsync("hide-lesson-header");
    this.dreamScene.hud.setVisible(true);
  }

  handleInput(): void {
    if (this.input?.justPressed("interact")) {
      const currentFlow = this.dreamScene.flowController?.getCurrentFlow();
      if (currentFlow) {
        events.interactions.sync.emit("interaction/accept", {
          id: currentFlow.flowName,
        });
      }
    }
  }

  update(): void {}

  exit(): void {}
}
