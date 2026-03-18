import { events } from "@/events/events";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { EventController } from "@/libs/events/EventController";
import {
  LearningNodeAsyncEvents,
  LearningNodeSyncEvents,
} from "@/events/actors/learningNode/events";
import { LEARNING_NODE_STATES } from "./constants/states";
import { createLearningNodeStateMachine } from "./helpers/createLearningNodeStateMachine";
import { SproutAnimations } from "./animations/SproutAnimations";

interface CreatePayload {
  startX: number;
  startY: number;
  flipX: boolean;
}

export class LearningNode {
  public static readonly STATES = LEARNING_NODE_STATES;

  public sprout = new SproutAnimations();
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
  public sprite!: Phaser.Physics.Arcade.Sprite;

  preload(scene: Phaser.Scene) {
    this.sprout.preload(scene);
  }

  create(scene: Phaser.Scene, { startX, startY, flipX }: CreatePayload) {
    const groundPositionY = startY;
    const handPositionY = groundPositionY - 360;
    this.references = {
      handPositionX: startX,
      groundPositionY,
      handPositionY,
    };

    this.sprite = this.sprout.create(scene, {
      startX,
      startY: groundPositionY,
      flipX,
    });

    this.eventController = new EventController(
      events.actors.learningNode.sync,
      events.actors.learningNode.async,
    );

    this.stateMachine = createLearningNodeStateMachine(scene, this);

    this.attachEvents();
  }

  private attachEvents() {
    this.eventController.addAsyncEvent("plant", () => {
      this.stateMachine.changeTo(LearningNode.STATES.PLANT_LEARNING_NODE);
    });
  }

  update(delta: number) {
    if (this.stateMachine) {
      this.stateMachine.updateAndHandleInput(delta);
    }
  }

  destroy() {
    this.sprout.destroy();
    this.stateMachine.clear();
    events.actors.learningNode.sync.clear();
    events.actors.learningNode.async.clear();
  }
}
