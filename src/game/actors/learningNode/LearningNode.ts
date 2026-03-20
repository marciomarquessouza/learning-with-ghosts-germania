import { events } from "@/events/events";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { EventController } from "@/libs/events/EventController";
import {
  LearningNodeAsyncEvents,
  LearningNodeSyncEvents,
} from "@/events/actors/learningNode/events";
import { LEARNING_NODE_STATES } from "./constants/states";
import { createLearningNodeStateMachine } from "./helpers/createLearningNodeStateMachine";
import { LearningNodeAnimations as Animations } from "./animations/LearningNodeAnimations";

interface CreatePayload {
  startX: number;
  startY: number;
  flipX: boolean;
}

export class LearningNode {
  public static readonly STATES = LEARNING_NODE_STATES;

  public animations = new Animations();
  public references: {
    groundPositionY: number;
    handPositionX: number;
    handPositionY: number;
  } | null = null;
  public stateMachine!: StateMachine;
  public eventController!: EventController<
    LearningNodeSyncEvents,
    LearningNodeAsyncEvents
  >;
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  spawn(scene: Phaser.Scene, { startX, startY, flipX }: CreatePayload) {
    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setVisible(false);
    const groundPositionY = startY;
    const handPositionY = groundPositionY - 360;
    this.references = {
      handPositionX: startX,
      groundPositionY,
      handPositionY,
    };

    this.animations.create(scene, this.sprite);

    this.eventController = new EventController(
      events.actors.learningNode.sync,
      events.actors.learningNode.async,
    );

    this.stateMachine = createLearningNodeStateMachine(scene, this);

    this.attachEvents();
  }

  private attachEvents() {
    this.eventController.addAsyncEvent("sprouting:transition", () => {
      this.stateMachine.changeTo(LearningNode.STATES.SPROUTING);
    });
  }

  update(delta: number) {
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.animations.destroy();
    this.stateMachine.clear();
    this.eventController.offAllEvents();
  }
}
