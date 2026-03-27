import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { InteractionArea } from "@/libs/game/interaction/InteractionArea";
import { events } from "@/events/events";
import { InputController } from "@/libs/inputs/InputController";
import { createInputController } from "@/libs/inputs/createInputController";

export class IdleState extends BaseState {
  private isStateRunning = false;
  private lessonInteractionArea: InteractionArea = new InteractionArea();
  private input?: InputController;

  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    if (this.isStateRunning) return;

    this.input = createInputController(this.scene);
    const playerSprite = this.dreamScene.player.sprite;
    const tutorSprite = this.dreamScene.tutor.sprite;

    if (!playerSprite || !tutorSprite) {
      this.stateMachine.log("Actors Sprite not available", "error");
      return;
    }

    this.lessonInteractionArea.create(this.scene, {
      player: playerSprite,
      target: tutorSprite,
      width: 500,
      height: 400,
      offsetX: -180,
      onEnter: () => this.onEnterLessonInteractionArea(),
      onLeave: () => this.onLeaveLessonInteractionArea(),
    });

    this.isStateRunning = true;
  }

  private onEnterLessonInteractionArea() {
    events.game.sync.emit("game-message/show", {
      title: "Talk with Eliza",
      text: "Press the Space key or the “E” key on your keyboard.",
    });
  }

  private onLeaveLessonInteractionArea() {
    events.game.sync.emit("game-message/hide", {});
  }

  update(): void {
    this.lessonInteractionArea.update();
  }

  handleInput(): void {
    if (!this.lessonInteractionArea.isOverlapping) return;

    if (this.input?.justPressed("interact")) {
      this.changeTo(DreamScene.STATES.LESSON_STARTING);
    }
  }

  exit(): void {
    events.game.sync.emit("game-message/hide", {});
    this.lessonInteractionArea.destroy();
    this.input?.clear();
    this.input = undefined;
    this.isStateRunning = false;
  }
}
