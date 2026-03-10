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

    return this.sprite;
  }

  attachEvents() {
    this.eventController.addSyncEvent("listening", () => {
      this.stateMachine.changeTo(JOSEF_STATES.LISTENING);
    });

    this.eventController.addSyncEvent("speaking", () => {
      this.stateMachine.changeTo(JOSEF_STATES.SPEAKING);
    });
  }

  update(_time: number, delta: number) {
    if (!this.sprite) return;

    if (this.stateMachine) {
      this.stateMachine.updateAndHandleInput(delta);
    }

    const left = this.cursors?.left.isDown || this.keyMap?.A?.isDown;
    const right = this.cursors?.right.isDown || this.keyMap?.D?.isDown;

    let vx = 0;
    if (left) {
      vx -= this.speed;
      this.sprite.flipX = true;
    }
    if (right) {
      vx += this.speed;
      this.sprite.flipX = false;
    }

    const moving = vx !== 0;

    // remove after test
    if (moving) {
      this.animations.playMoving();
    } else {
      this.animations.playIdle();
    }

    this.sprite.setVelocityX(vx);

    this.levitation.update(delta);
  }

  destroy() {
    this.stateMachine.clear();
    this.eventController.offAllEvents();
  }
}

export const josef = new Josef();
