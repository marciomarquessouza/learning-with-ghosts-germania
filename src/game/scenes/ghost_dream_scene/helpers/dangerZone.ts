import { ACHTUNG_SIGN_IMG } from "@/constants/images";
import { InteractionArea } from "@/libs/game/InteractionArea";

interface Options {
  startX: number;
  startY: number;
  player: Phaser.Physics.Arcade.Sprite;
  onEnter: () => void;
  onLeave: () => void;
}

const ACHTUNG_SIGN = "testImage";

class DangerZone {
  private interactionArea: InteractionArea | null = null;
  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(ACHTUNG_SIGN, ACHTUNG_SIGN_IMG);
  }

  create(
    scene: Phaser.Scene,
    { startX, startY, player, onEnter, onLeave }: Options,
  ) {
    const container = scene.add.container(startX, startY);
    const achtungImage = scene.add.image(0, 0, ACHTUNG_SIGN).setAlpha(0.75);
    achtungImage.setBlendMode(Phaser.BlendModes.MULTIPLY);
    container.add(achtungImage);

    this.interactionArea = new InteractionArea();
    this.interactionArea.create(scene, {
      player,
      target: achtungImage,
      width: achtungImage.width,
      height: achtungImage.height,
      onEnter,
      onLeave,
    });

    return container;
  }

  update() {
    this.interactionArea?.update();
  }

  destroy() {}
}

export const dangerZone = new DangerZone();
