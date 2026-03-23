import { ActorPayload } from "../types/Actor";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { events } from "@/events/events";
import {
  TutorAsyncEvents,
  TutorSyncEvents,
} from "@/events/actors/tutor/events";
import { EventController } from "@/libs/events/EventController";
import { TUTOR_STATES } from "./constants/states";
import { TutorAnimations } from "./animations/TutorAnimations";
import { createTutorStateMachine } from "./helpers/createTutorStateMachine";

export class Tutor {
  public static readonly STATES = TUTOR_STATES;

  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public animations = new TutorAnimations();
  public eventController!: EventController<TutorSyncEvents, TutorAsyncEvents>;

  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  spawn(scene: Phaser.Scene, payload: ActorPayload) {
    const { startX, startY, scale, flipX } = payload;

    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setScale(scale || 1);

    this.animations.create(scene, this.sprite);

    this.eventController = new EventController(
      events.actors.tutor.sync,
      events.actors.tutor.async,
    );

    this.stateMachine = createTutorStateMachine(scene, this);
    this.stateMachine.changeTo(Tutor.STATES.IDLE);

    this.attachEvents();
  }

  private attachEvents() {
    this.eventController.addSyncEvent("idle", () => {
      this.stateMachine.changeTo(Tutor.STATES.IDLE);
    });

    this.eventController.addSyncEvent("teaching", () => {
      this.stateMachine.changeTo(Tutor.STATES.TEACHING);
    });

    this.eventController.addAsyncEvent("sowing", () => {
      this.stateMachine.changeTo(Tutor.STATES.SOWING);
    });
  }

  update(delta: number) {
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.stateMachine.clear();
    this.eventController.offAllEvents();
  }
}
