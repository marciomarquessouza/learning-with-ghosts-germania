import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { ActorPayload } from "../types/Actor";
import { getRequired } from "@/utils/getRequired";
import { GUARDIAN_STATES } from "./constants/states";
import { GuardianAnimations } from "./animations/GuardianAnimations";
import { createGuardianStateMachine } from "./helpers/createGuardianStateMachine";

export class Guardian {
  public static readonly STATES = GUARDIAN_STATES;

  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private stateMachine!: StateMachine;
  private _isLeaning = false;

  public hasCreated = false;
  public animations = new GuardianAnimations();

  public get scene(): Phaser.Scene {
    return getRequired(this._scene, "Guardian", "_scene");
  }

  public get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return getRequired(this._sprite, "Guardian", "_sprite");
  }

  public get isLeaning(): boolean {
    return this._isLeaning;
  }

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  create(scene: Phaser.Scene, payload: ActorPayload) {
    const { startX, startY, scale, flipX } = payload;

    this._scene = scene;

    this._sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setScale(scale ?? 1)
      .setAlpha(0);

    this.animations.create(scene, this.sprite);

    this.stateMachine = createGuardianStateMachine(scene, this);
    this.stateMachine.changeTo(Guardian.STATES.INITIAL);
    this.hasCreated = true;
  }

  setAlpha(alpha: number) {
    this.sprite.setAlpha(alpha);
  }

  async fadeIn(): Promise<void> {
    await this.animations.playFadeIn();
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  fadeOut(): Promise<void> {
    return this.animations.playFadeOut();
  }

  enterIdleState() {
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  enterSpeakingState() {
    this.stateMachine.changeTo(Guardian.STATES.SPEAKING);
  }

  async lean(): Promise<void> {
    if (this._isLeaning) return;
    this.setAlpha(1);
    await this.animations.playLean();
    this._isLeaning = true;
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  async unlean(): Promise<void> {
    if (!this._isLeaning) return;
    this.setAlpha(1);
    await this.animations.playUnlean();
    this._isLeaning = false;
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  update(delta: number) {
    this.stateMachine?.update(delta);
  }

  destroy() {
    this.sprite.destroy();
    this.stateMachine.clear();
  }
}
