import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { events } from "@/events/events";
import { createInputController } from "@/libs/inputs/createInputController";
import { InputController } from "@/libs/inputs/InputController";

export class PerformingLessonState extends BaseState {
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

    this.dreamScene.hud.setVisible(false);

    const tutorContainer = this.dreamScene.tutor.container;
    this.dreamScene.player.faceTarget(tutorContainer.x);

    if (!this.dreamScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    this.dreamScene.gameCamera.zoomTo({ zoom: 1.2, duration: 1_000 });
    const playerSprite = this.dreamScene.player.sprite;

    if (playerSprite) {
      this.dreamScene.gameCamera.centerOn(playerSprite.x, playerSprite.y);
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
