import { Sprout, sprout } from "./helpers/sprout";
import { events } from "@/events/events";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { createPumpkinStateMachine } from "./stateMachine/createPumpkinStateMachine";
import { EventController } from "@/libs/events/EventController";
import {
  PumpkinAsyncEvents,
  PumpkinSyncEvents,
} from "@/events/actors/pumpkin/events";
import { PUMPKIN_STATES } from "./stateMachine/pumpkinStates";

interface CreatePayload {
  startX: number;
  startY: number;
  flipX: boolean;
}

export class PumpkinKids {
  public sprout!: Sprout;
  public references: {
    groundPositionY: number;
    handPositionX: number;
    handPositionY: number;
  } | null = null;
  public stateMachine!: StateMachine;
  public eventController!: EventController<
    PumpkinSyncEvents,
    PumpkinAsyncEvents
  >;

  preload(scene: Phaser.Scene) {
    sprout.preload(scene);
  }

  create(scene: Phaser.Scene, { startX, startY, flipX }: CreatePayload) {
    const groundPositionY = startY;
    const handPositionY = groundPositionY - 360;
    this.references = {
      handPositionX: startX,
      groundPositionY,
      handPositionY,
    };

    this.sprout = sprout.create(scene, {
      startX,
      startY: groundPositionY,
      flipX,
    });

    this.eventController = new EventController(
      events.actors.pumpkinKid.sync,
      events.actors.pumpkinKid.async,
    );

    this.stateMachine = createPumpkinStateMachine(scene, this);

    this.attachEvents();
  }

  private attachEvents() {
    this.eventController.addAsyncEvent("plant-pumpkin", () => {
      this.stateMachine.changeTo(PUMPKIN_STATES.PLANT_PUMPKIN);
    });
  }

  update(delta: number) {
    if (this.stateMachine) {
      this.stateMachine.updateAndHandleInput(delta);
    }
  }

  destroy() {
    sprout.destroy();
    this.stateMachine.clear();
    events.actors.pumpkinKid.sync.clear();
    events.actors.pumpkinKid.async.clear();
  }
}

export const pumpkinKids = new PumpkinKids();
