import { GhostAnimations } from "./helpers/Animations";
import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";
import { events } from "@/events/events";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { createJosefStateMachine } from "./stateMachine/createJosefStateMachine";
import { EventController } from "@/libs/events/EventController";
import {
  JosefAsyncEvents,
  JosefSyncEvents,
} from "@/events/actors/josef/events";
import { JOSEF_STATES } from "./stateMachine/josefStates";
import { Shadow } from "./helpers/Shadow";
import { Levitation } from "./helpers/Levitation";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;
const DEFAULT_SPEED = 200;

export class Josef {
  public speed = DEFAULT_SPEED;
  public eventController!: EventController<JosefSyncEvents, JosefAsyncEvents>;
  public sprite: Phaser.Physics.Arcade.Sprite | null = null;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  public keyMap: Partial<
    Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>
  > | null = null;
  public animations = new GhostAnimations();
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
      events.actors.josef.sync,
      events.actors.josef.async,
    );

    this.stateMachine = createJosefStateMachine(scene, this);
    // Initial State
    this.stateMachine.changeTo(JOSEF_STATES.IDLE);

    this.attachEvents();

    return this.sprite;
  }

  attachEvents() {
    this.eventController.addSyncEvent("idle", () => {
      this.stateMachine.changeTo(JOSEF_STATES.IDLE);
    });

    this.eventController.addSyncEvent("listening", () => {
      this.stateMachine.changeTo(JOSEF_STATES.LISTENING);
    });

    this.eventController.addSyncEvent("speaking", () => {
      this.stateMachine.changeTo(JOSEF_STATES.SPEAKING);
    });

    this.gameEventsToRemove.push(
      events.game.sync.on("dialogue/show", () => {
        this.stateMachine.changeTo(JOSEF_STATES.LISTENING);
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
