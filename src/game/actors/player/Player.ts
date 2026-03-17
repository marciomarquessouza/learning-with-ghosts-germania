import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";
import { events } from "@/events/events";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { EventController } from "@/libs/events/EventController";
import { Shadow } from "./helpers/Shadow";
import { Levitation } from "./helpers/Levitation";
import { PLAYER_STATES } from "./constants/states";
import {
  PlayerAsyncEvents,
  PlayerSyncEvents,
} from "@/events/actors/player/events";
import { PlayerAnimations } from "./animations/PlayerAnimations";
import { createPlayerStateMachine } from "./helpers/createPlayerStateMachine";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;
const DEFAULT_SPEED = 200;

export class Player {
  public static readonly STATES = PLAYER_STATES;

  public speed = DEFAULT_SPEED;
  public eventController!: EventController<PlayerSyncEvents, PlayerAsyncEvents>;
  public sprite: Phaser.Physics.Arcade.Sprite | null = null;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  public keyMap: Partial<
    Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>
  > | null = null;
  public animations = new PlayerAnimations();
  private shadow = new Shadow();
  private levitation = new Levitation();
  private stateMachine!: StateMachine;
  private gameEventsToRemove: (() => void)[] = [];

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
    this.shadow.preload(scene);
  }

  create(scene: Phaser.Scene, { startX, startY, cursors }: ActorPayload) {
    this.sprite = this.animations.create(scene, startX, startY);
    this.shadow.create(scene, startX, startY);
    this.levitation.create(this.sprite, this.shadow);
    this.cursors = cursors;
    this.keyMap = createKeyMap(scene, [KEY_CODES.A, KEY_CODES.D]);

    this.eventController = new EventController(
      events.actors.player.sync,
      events.actors.player.async,
    );

    this.stateMachine = createPlayerStateMachine(scene, this);
    // Initial State
    this.stateMachine.changeTo(Player.STATES.IDLE);

    this.attachEvents();

    return this.sprite;
  }

  attachEvents() {
    this.eventController.addSyncEvent("idle", () => {
      this.stateMachine.changeTo(Player.STATES.IDLE);
    });

    this.eventController.addSyncEvent("listening", () => {
      this.stateMachine.changeTo(Player.STATES.LISTENING);
    });

    this.eventController.addSyncEvent("speaking", () => {
      this.stateMachine.changeTo(Player.STATES.SPEAKING);
    });

    this.eventController.addSyncEvent("scared", () => {
      this.stateMachine.changeTo(Player.STATES.SCARED);
    });

    this.gameEventsToRemove.push(
      events.game.sync.on("dialogue/show", () => {
        this.stateMachine.changeTo(Player.STATES.LISTENING);
      }),
    );

    this.gameEventsToRemove.push(
      events.game.sync.on("dialogue/hide", () => {
        this.stateMachine.changeTo(this.stateMachine.getPreviousStateName());
      }),
    );
  }

  public getHorizontalInput() {
    if (!this.sprite) {
      return {
        left: false,
        right: false,
        velocityX: 0,
      };
    }

    const left = this.cursors?.left.isDown || this.keyMap?.A?.isDown;
    const right = this.cursors?.right.isDown || this.keyMap?.D?.isDown;

    let velocityX = 0;

    if (left) {
      velocityX -= this.speed;
      this.sprite.flipX = true;
    }

    if (right) {
      velocityX += this.speed;
      this.sprite.flipX = false;
    }

    return { left, right, velocityX };
  }

  faceTarget(target?: Phaser.GameObjects.Sprite) {
    if (!this.sprite || !target) return;
    this.sprite.setFlipX(target.x < this.sprite.x);
  }

  update(_time: number, delta: number) {
    if (!this.sprite) return;
    this.stateMachine?.updateAndHandleInput(delta);
    this.levitation.update(delta);
  }

  destroy() {
    this.stateMachine.clear();
    this.eventController.offAllEvents();
    this.gameEventsToRemove.forEach((remove) => remove());
  }
}
