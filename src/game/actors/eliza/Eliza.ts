import { ElizaAnimations } from "./animations/ElizaAnimations";
import { ActorPayload } from "../types/Actor";
import { createKeyMap, KeyMap } from "@/utils/createKeyMap";
import { InteractionArea } from "@/libs/game/InteractionArea";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { createElizaInteractionArea } from "./helpers/createElizaInteractionArea";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";
import { createElizaStateMachine } from "./helpers/createElizaStateMachine";
import {
  ElizaAsyncEvents,
  ElizaSyncEvents,
} from "@/events/actors/eliza/events";
import { EventController } from "@/libs/events/EventController";
import { ELIZA_STATES } from "./constants/states";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export interface ElisaPayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  camera: Phaser.Cameras.Scene2D.Camera;
}

export class Eliza {
  public static readonly STATES = ELIZA_STATES;

  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public interactionArea!: InteractionArea;
  public dayActions: DayActions | null = null;
  public animations = new ElizaAnimations();
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public keyMap!: KeyMap;
  public eventController!: EventController<ElizaSyncEvents, ElizaAsyncEvents>;

  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  create(scene: Phaser.Scene, payload: ElisaPayload) {
    const { dayActions, player, startX, startY, scale, flipX } = payload;

    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setScale(scale || 1);
    this.animations.create(scene, this.sprite);

    this.dayActions = dayActions ?? null;

    this.cursors = payload.cursors;
    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);
    this.interactionArea = createElizaInteractionArea(scene, {
      eliza: this,
      player,
      onEnter: this.dayActions?.onEnterElizaArea,
      onLeave: () => events.game.sync.emit("game-message/hide", {}),
    });

    this.eventController = new EventController(
      events.actors.eliza.sync,
      events.actors.eliza.async,
    );
    this.attachEvents();

    this.stateMachine = createElizaStateMachine(scene, this);
    this.stateMachine.changeTo(Eliza.STATES.WAITING);
  }

  private attachEvents() {
    this.eventController.addSyncEvent("idle", () => {
      this.stateMachine.changeTo(Eliza.STATES.IDLE);
    });

    this.eventController.addSyncEvent("teaching", () => {
      this.stateMachine.changeTo(Eliza.STATES.TEACHING);
    });

    this.eventController.addAsyncEvent("sowing", () => {
      this.stateMachine.changeTo(Eliza.STATES.SOWING);
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
