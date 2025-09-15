import { CONFESSIONAL_IMG } from "@/constants/images";
import { elisaAnimation } from "./helpers/ElisaAniamtions";

export const CONFESSIONAL = "confessional";

export class GhostElisa {
  sprite: Phaser.Physics.Arcade.Sprite | null = null;

  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(CONFESSIONAL, CONFESSIONAL_IMG);
    elisaAnimation.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    scene.physics.add.sprite(startX, startY, CONFESSIONAL);
    this.sprite = elisaAnimation.create(scene, startX, startY);
    this.sprite.play(elisaAnimation.animations.ELISA_IDLE_ANIM, true);
  }
}

export const ghostElisa = new GhostElisa();
