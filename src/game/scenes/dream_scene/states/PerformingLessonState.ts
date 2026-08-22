import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { events } from "@/events/events";
import { createInputController } from "@/libs/inputs/createInputController";
import { InputController } from "@/libs/inputs/InputController";

const CLOSE_TITLE_AFTER = 2_500;

export class PerformingLessonState extends BaseState {
  private input: InputController;
  private isFirstLessonState = false;

  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
    this.input = createInputController(this.scene);
  }

  enter(): void {
    const previousState = this.stateMachine.getPreviousStateName();
    const currentState = this.stateMachine.getCurrentStateName();
    const isFirstLessonState = previousState !== currentState;
    this.isFirstLessonState = isFirstLessonState;

    if (isFirstLessonState) {
      this.lessonPreparation();
    }

    this.runLessonFlow();
  }

  private lessonPreparation() {
    events.game.sync.emit("game-action-prompt/hide");
    events.game.sync.emit("dialogue/hide");

    this.dreamScene.hud.setVisible(false);

    const tutorContainer = this.dreamScene.tutor.container;
    this.dreamScene.player.faceTarget(tutorContainer.x);

    const completedEntries = this.dreamScene.lessonManager.completedEntries;

    this.dreamScene.knowledgeTroop.addByEntries(completedEntries);

    if (!this.dreamScene.flowController) {
      this.stateMachine.log("Scene flow was not created", "error");
      return;
    }

    const playerSprite = this.dreamScene.player.sprite;

    if (playerSprite) {
      const mapWidth = this.dreamScene.scenario.width;
      const mapHeight = this.dreamScene.scenario.height;
      this.dreamScene.gameCamera.setBoundsWithCenterPadding(
        0,
        0,
        mapWidth,
        mapHeight,
      );
      this.dreamScene.gameCamera.centerOnTarget(playerSprite);
      this.dreamScene.gameCamera.zoomTo({ zoom: 1.2, duration: 1_000 });
    }
  }

  private async runLessonFlow() {
    try {
      if (!this.dreamScene.flowController) {
        throw new Error("The flow controller has not been initialized.");
      }

      const flow = this.dreamScene.flowController.getNextFlow();

      if (!flow) {
        throw new Error("Flow not found");
      }

      this.dreamScene.flowController.clearNextFlow();

      if (this.isFirstLessonState) {
        await this.dreamScene.lessonManager.showLessonTitle({
          title: this.dreamScene.lessonManager.lesson.title,
          day: this.dreamScene.lessonManager.lesson.day,
          closeAfter: CLOSE_TITLE_AFTER,
        });
      }

      this.dreamScene.flowController.run(flow).then(({ nextState }) => {
        if (nextState) {
          this.changeTo(nextState);
        }
      });
    } catch (error) {
      this.stateMachine.log(error, "error");
      this.dreamScene.flowController?.clearNextFlow();
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
    if (this.input?.justPressed("cancel")) {
      const currentFlow = this.dreamScene.flowController?.getCurrentFlow();
      if (currentFlow) {
        events.interactions.sync.emit("interaction/cancel", {
          id: currentFlow.flowName,
        });
      }
    }
    if (this.input?.justPressed("repeat")) {
      const currentFlow = this.dreamScene.flowController?.getCurrentFlow();
      if (currentFlow) {
        events.interactions.sync.emit("interaction/repeat", {
          id: currentFlow.flowName,
        });
      }
    }
  }

  update(): void {}

  exit(): void {}
}
