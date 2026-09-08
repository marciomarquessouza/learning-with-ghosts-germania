import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { attachGuardian } from "../helpers/attachGuardian";

export class PerformingReviewState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    this.dreamScene.hud.setVisible(true);
    this.dreamScene.flowController?.clearNextFlow();

    if (!this.dreamScene.tutor.isDestroyed) {
      this.dreamScene.removeTutor();
    }

    this.dreamScene.player.lockInput();
    this.dreamScene.knowledgeTroop.stopToFollowPlayer();

    if (!this.dreamScene.guardian.hasCreated) {
      attachGuardian(this.dreamScene);
    }

    if (!this.dreamScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    const flow = this.dreamScene.flowController.getNextFlow();

    if (!flow) {
      throw new Error("Flow not found");
    }

    try {
      this.dreamScene.flowController
        .run(flow)
        .then(({ nextState }) => {
          this.changeTo(nextState ?? DreamScene.STATES.PERFORMING_REVIEW);
        })
        .catch((error) => {
          this.stateMachine.log(error, "error");
          this.changeTo(DreamScene.STATES.IDLE);
        });
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.dreamScene.flowController?.clearNextFlow();
      this.changeTo(DreamScene.STATES.IDLE);
    }
  }

  handleInput(): void {}

  update(): void {}

  exit(): void {}
}
