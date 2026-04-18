import { MOODS } from "@/constants/game";
import { ActorPayload } from "../../types/Actor";
import { Jailer } from "../Jailer";
import { JailerAnimations } from "./animations/JailerAnimations";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { IdleState } from "./states/IdleState";

export class JailerPortrait extends Jailer {
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public animations = new JailerAnimations();
  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene): void {
    this.animations.preload(scene);
  }

  create(scene: Phaser.Scene, payload: ActorPayload): void {
    const { startX, startY, scale } = payload;
    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setScale(scale)
      .setOrigin(0.5, 0);

    this.animations.create(scene, this.sprite);

    this.stateMachine = new StateMachine(scene);
    this.stateMachine.addState(Jailer.STATES.IDLE, IdleState, this);
    this.stateMachine.changeTo(Jailer.STATES.IDLE);
  }

  public getSprite(): Phaser.GameObjects.Sprite {
    if (!this.sprite) {
      throw new Error("Tutor sprite was not initialized. Call create() first.");
    }

    return this.sprite;
  }

  setActiveAndVisible(value: boolean): void {
    this.sprite.setActive(value).setVisible(value);
  }

  interactions(mood: MOODS): void {
    throw new Error("Method not implemented.");
  }

  update(delta: number): void {
    this.stateMachine.updateAndHandleInput(delta);
  }

  destroy(): void {
    this.sprite.destroy();
    this.stateMachine.clear();
  }
}
