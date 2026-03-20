import { ActorPayload } from "../types/Actor";
import { createKeyMap, KeyMap } from "@/utils/createKeyMap";
import { InteractionArea } from "@/libs/game/InteractionArea";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";
import {
  TutorAsyncEvents,
  TutorSyncEvents,
} from "@/events/actors/tutor/events";
import { EventController } from "@/libs/events/EventController";
import { TUTOR_STATES } from "./constants/states";
import { TutorAnimations } from "./animations/TutorAnimations";
import { createTutorInteractionArea } from "./helpers/createTutorInteractionArea";
import { createTutorStateMachine } from "./helpers/createTutorStateMachine";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export interface CreatePayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  camera: Phaser.Cameras.Scene2D.Camera;
}

export class Tutor {
  public static readonly STATES = TUTOR_STATES;

  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public interactionArea!: InteractionArea;
  public dayActions: DayActions | null = null;
  public animations = new TutorAnimations();
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public keyMap!: KeyMap;
  public eventController!: EventController<TutorSyncEvents, TutorAsyncEvents>;

  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  spawn(scene: Phaser.Scene, payload: CreatePayload) {
    const { dayActions, player, startX, startY, scale, flipX } = payload;

    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setScale(scale || 1);
    this.animations.create(scene, this.sprite);

    this.dayActions = dayActions ?? null;

    this.cursors = payload.cursors;
    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);
    this.interactionArea = createTutorInteractionArea(scene, {
      tutor: this,
      player,
      onEnter: this.dayActions?.onEnterTutorArea,
      onLeave: () => events.game.sync.emit("game-message/hide", {}),
    });

    this.eventController = new EventController(
      events.actors.tutor.sync,
      events.actors.tutor.async,
    );
    this.attachEvents();

    this.stateMachine = createTutorStateMachine(scene, this);
    this.stateMachine.changeTo(Tutor.STATES.WAITING);
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
