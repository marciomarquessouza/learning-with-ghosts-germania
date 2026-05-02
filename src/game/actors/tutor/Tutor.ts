import { ActorPayload } from "../types/Actor";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { TUTOR_STATES } from "./constants/states";
import { TutorAnimations } from "./animations/TutorAnimations";
import { createTutorStateMachine } from "./helpers/createTutorStateMachine";

export class Tutor {
  public static readonly STATES = TUTOR_STATES;

  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public animations = new TutorAnimations();

  private resolveSowing: (() => void) | null = null;
  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  create(scene: Phaser.Scene, payload: ActorPayload) {
    const { startX, startY, scale, flipX } = payload;

    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setScale(scale || 1);

    this.animations.create(scene, this.sprite);

    this.stateMachine = createTutorStateMachine(scene, this);
    this.stateMachine.changeTo(Tutor.STATES.IDLE);
  }

  enterIdle() {
    this.stateMachine.changeTo(Tutor.STATES.IDLE);
  }

  enterTeaching() {
    this.stateMachine.changeTo(Tutor.STATES.TEACHING);
  }

  async waitForSowing(): Promise<void> {
    return new Promise((resolve) => {
      this.resolveSowing = resolve;
      this.stateMachine.changeTo(Tutor.STATES.SOWING);
    });
  }

  finishSowing() {
    this.resolveSowing?.();
    this.resolveSowing = null;
  }

  update(delta: number) {
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.stateMachine.clear();
  }
}
