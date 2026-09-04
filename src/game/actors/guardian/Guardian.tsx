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

  public animations = new GuardianAnimations();

  public get scene(): Phaser.Scene {
    return getRequired(this._scene, "Guardian", "_scene");
  }

  public get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return getRequired(this._sprite, "Guardian", "_sprite");
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
      .setVisible(false)
      .setAlpha(0);

    this.animations.create(scene, this.sprite);

    this.stateMachine = createGuardianStateMachine(scene, this);
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  setVisibleAndAlpha(visibility: boolean, alpha: number) {
    this.sprite.setAlpha(alpha);
    this.sprite.setVisible(visibility);
  }

  fadeIn() {
    this.animations.playFadeIn();
  }

  fadeOut() {
    this.animations.playFadeOut();
  }

  enterIdleState() {
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  async lean(): Promise<void> {
    await this.animations.playLean();
    this.stateMachine.changeTo(Guardian.STATES.LEAN_IDLE);
  }

  async unlean(): Promise<void> {
    await this.animations.playUnlean();
    this.stateMachine.changeTo(Guardian.STATES.IDLE);
  }

  enterLeanIdleState() {
    this.stateMachine.changeTo(Guardian.STATES.LEAN_IDLE);
  }

  enterLeanSpeakingState() {
    this.stateMachine.changeTo(Guardian.STATES.LEAN_SPEAKING);
  }

  update(delta: number) {
    this.stateMachine.update(delta);
  }

  destroy() {
    this.sprite.destroy();
    this.stateMachine.clear();
  }
}
