import { BaseState } from "@/libs/game/state-machine/BaseState";
import { createInputController } from "@/libs/inputs/createInputController";
import { InputController } from "@/libs/inputs/InputController";
import { DreamScene } from "..";

export class PostLessonState extends BaseState {
  private input: InputController;

  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
    this.input = createInputController(scene);
  }

  enter(): void {
    this.dreamScene.gameCamera.zoomTo({ zoom: 1, duration: 1_000 });
    this.dreamScene.hud.setVisible(true);
    this.dreamScene.flowController?.clearNextFlow();
    this.dreamScene.player.enterIdle();
    this.dreamScene.tutor.enterAway();
    this.dreamScene.knowledgeTroop.startToFollowTarget();
  }

  handleInput(): void {}

  update(): void {}

  exit(): void {}
}
