import { confessional } from "./helpers/Confessional";
import { elisaAnimations } from "./helpers/ElisaAnimations";

export class GhostElisa {
  sprite: Phaser.Physics.Arcade.Sprite | null = null;

  preload(scene: Phaser.Scene) {
    confessional.preload(scene);
    elisaAnimations.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    this.sprite = elisaAnimations.create(scene, 130, 0);
    confessional.create(scene, this.sprite, startX, startY);

    this.sprite.play(elisaAnimations.animations.ELISA_IDLE_ANIM, true);
  }
}

export const ghostElisa = new GhostElisa();
