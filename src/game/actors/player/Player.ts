import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { Shadow } from "./effects/Shadow";
import { Levitation } from "./effects/Levitation";
import { PLAYER_STATES } from "./constants/states";
import { PlayerAnimations } from "./animations/PlayerAnimations";
import { createPlayerStateMachine } from "./helpers/createPlayerStateMachine";
import { getRequired } from "@/utils/getRequired";
import { AudioRecordButton } from "./components/AudioRecordButton";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;
const DEFAULT_SPEED = 200;

interface PlayerCreatePayload extends ActorPayload {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
}

export class Player {
  public static readonly STATES = PLAYER_STATES;

  public speed = DEFAULT_SPEED;

  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private shadow = new Shadow();
  private levitation = new Levitation();
  private stateMachine!: StateMachine;

  public cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  public keyMap: Partial<
    Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>
  > | null = null;
  public audioRecordButton = new AudioRecordButton();
  public animations = new PlayerAnimations();
  public sawMovementInstructions = false;
  public hadMovement = false;

  public get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return getRequired(this._sprite, "Player", "_sprite");
  }

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
    this.shadow.preload(scene);
    this.audioRecordButton.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    { startX, startY, cursors }: PlayerCreatePayload,
  ) {
    this._sprite = scene.physics.add
      .sprite(startX, startY, "ghost", 0)
      .setDepth(10)
      .setCollideWorldBounds(true);
    this.animations.create(scene, this._sprite);

    this._sprite.body.setSize(48, 96);
    this._sprite.body.setOffset(24, 32);

    this.shadow.create(scene, startX, startY);
    this.levitation.create(this._sprite, this.shadow);
    this.cursors = cursors;
    this.keyMap = createKeyMap(scene, [KEY_CODES.A, KEY_CODES.D]);

    this.audioRecordButton.create(scene);
    this.audioRecordButton.setVisible(false);

    this.stateMachine = createPlayerStateMachine(scene, this);

    // Initial State
    this.stateMachine.changeTo(Player.STATES.IDLE);

    return this._sprite;
  }

  enterIdle() {
    this.stateMachine.changeTo(Player.STATES.IDLE);
  }

  enterListening() {
    this.stateMachine.changeTo(Player.STATES.LISTENING);
  }

  enterSpeaking() {
    this.stateMachine.changeTo(Player.STATES.SPEAKING);
  }

  enterScared() {
    this.stateMachine.changeTo(Player.STATES.SCARED);
  }

  enterInclined() {
    this.stateMachine.changeTo(Player.STATES.INCLINED);
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

  faceTarget(targetX: number) {
    this.sprite.setFlipX(targetX < this.sprite.x);
  }

  attachRecordButton({
    onStartRecord,
    onStopRecord,
    skipNativeLoading,
  }: {
    skipNativeLoading?: boolean;
    onStartRecord?: () => void;
    onStopRecord?: () => void;
  }) {
    this.audioRecordButton.attach({
      target: this.sprite,
      position: "bottom",
      skipNativeLoading,
      onStartRecord,
      onStopRecord,
      offset: 20,
    });
    this.audioRecordButton.setVisible(true);
  }

  detachRecordButton() {
    this.audioRecordButton.setVisible(false);
    this.audioRecordButton.destroy();
  }

  update(_time: number, delta: number) {
    if (!this.sprite) return;
    this.stateMachine?.updateAndHandleInput(delta);
    this.levitation.update(delta);
  }

  destroy() {
    this.stateMachine.clear();
  }
}
