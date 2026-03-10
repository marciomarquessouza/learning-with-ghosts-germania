import { elizaAnimations } from "./helpers/ElizaAnimations";
import { ActorPayload } from "../types/Actor";
import { createKeyMap, KeyMap } from "@/utils/createKeyMap";
import { InteractionArea } from "@/libs/game/InteractionArea";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { ELIZA_STATES } from "./stateMachine/elizaStates";
import { createElizaInteractionArea } from "./helpers/createElizaInteractionArea";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";
import { createElizaStateMachine } from "./stateMachine/createElizaStateMachine";
import {
  ElizaAsyncEvents,
  ElizaSyncEvents,
} from "@/events/actors/eliza/events";
import { EventController } from "@/libs/events/EventController";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export interface ElisaPayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  camera: Phaser.Cameras.Scene2D.Camera;
}

export class Eliza {
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public interactionArea!: InteractionArea;
  public dayActions: DayActions | null = null;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public keyMap!: KeyMap;
  public eventController!: EventController<ElizaSyncEvents, ElizaAsyncEvents>;
  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene) {
    elizaAnimations.preload(scene);
  }

  create(scene: Phaser.Scene, payload: ElisaPayload) {
    const { dayActions, player } = payload;
    this.dayActions = dayActions ?? null;
    this.cursors = payload.cursors;
    this.sprite = elizaAnimations.create(scene, payload);
    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);
    this.interactionArea = createElizaInteractionArea(scene, {
      eliza: this,
      player,
      onEnter: this.dayActions?.onEnterElizaArea,
      onLeave: () => events.game.sync.emit("game-message/hide"),
    });

    this.eventController = new EventController(
      events.actors.eliza.sync,
      events.actors.eliza.async,
    );

    this.stateMachine = createElizaStateMachine(scene, this);

    // Initial State
    this.stateMachine.changeTo(ELIZA_STATES.WAITING);
    this.attachEvents();
  }

  private attachEvents() {
    this.eventController.addSyncEvent("idle", () => {
      this.stateMachine.changeTo(ELIZA_STATES.IDLE);
    });

    this.eventController.addSyncEvent("teaching", () => {
      throw new Error("State was not implemented");
    });

    this.eventController.addAsyncEvent("sowing", () => {
      this.stateMachine.changeTo(ELIZA_STATES.SOWING);
    });
  }

  update(delta: number) {
    if (this.stateMachine) {
      this.stateMachine.updateAndHandleInput(delta);
    }
  }

  destroy() {
    this.stateMachine.clear();
    events.actors.eliza.sync.clear();
    events.actors.eliza.async.clear();
  }
}
