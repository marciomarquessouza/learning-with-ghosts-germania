import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { InteractionArea } from "@/libs/game/interaction/InteractionArea";
import { events } from "@/events/events";
import { InputController } from "@/libs/inputs/InputController";
import { createInputController } from "@/libs/inputs/createInputController";
import { BeforeLessonFlow } from "../flows/lesson/0-introduction/BeforeLesson.flow";

export class IdleState extends BaseState {
  private lessonInteractionArea: InteractionArea = new InteractionArea();
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
  }

  private onEnterLessonInteractionArea() {
    this.dreamScene.dialogueManager.showGameActionPrompt({
      title: "Talk to the Masked Nun",
      description: "Press {{key|Space}} or {{key|E}} to interact",
      hideIcons: ["action"],
      fixed: false,
    });
  }

  private onLeaveLessonInteractionArea() {
    this.dreamScene.dialogueManager.hideGameActionPrompt();
  }

  update(): void {
    this.lessonInteractionArea.update();
  }

  handleInput(): void {
    if (
      this.input.justPressed("interact") &&
      this.lessonInteractionArea.isOverlapping
    ) {
      this.dreamScene.flowController?.setNextFlow(BeforeLessonFlow);
      this.changeTo(DreamScene.STATES.PERFORMING_ACTION);
    }

    if (this.input.justPressed("cancel")) {
      events.game.sync.emit("game-message/hide");
      events.game.sync.emit("game-action-prompt/hide");
    }
  }

  exit(): void {
    events.game.sync.emit("game-message/hide");
    this.lessonInteractionArea.destroy();
    this.input.clear();
  }
}
