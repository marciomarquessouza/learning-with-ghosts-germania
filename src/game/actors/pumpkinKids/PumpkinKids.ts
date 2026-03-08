import { seed } from "./helpers/seed";
import { onAnimationComplete } from "@/libs/animation/onAnimationComplete";
import { sprout, SPROUT_ANIMATIONS } from "./helpers/sprout";
import { DropSeedEvent } from "@/events/actors/pumpkin-kid/types";
import { events } from "@/events/events";

interface CreatePayload {
  startX: number;
  startY: number;
  flipX: boolean;
}

class PumpkinKids {
  private onDropSeed: (({ onFinish }: DropSeedEvent) => void) | null = null;

  preload(scene: Phaser.Scene) {
    sprout.preload(scene);
  }

  create(scene: Phaser.Scene, { startX, startY, flipX }: CreatePayload) {
    seed.create(scene);
    const groundPositionY = startY;
    const handPositionY = groundPositionY - 360;
    const sproutSprite = sprout.create(scene, startX, groundPositionY);
    sproutSprite.flipX = !!flipX;

    const afterSprouting = (onFinish: () => void) => {
      sproutSprite.play(SPROUT_ANIMATIONS.IDLE);
      onFinish();
    };

    this.onDropSeed = ({ onFinish }: DropSeedEvent) => {
      seed.dropSeed(scene, {
        x: startX,
        startY: handPositionY,
        groundY: groundPositionY,
        onImpact: () => {
          sproutSprite.play(SPROUT_ANIMATIONS.SPROUTING);
          onAnimationComplete(sproutSprite, SPROUT_ANIMATIONS.SPROUTING, () =>
            afterSprouting(onFinish),
          );
        },
      });
    };

    events.actors.pumpkinKid.sync.on(
      "pumpkin-kid/lesson:drop-seed",
      this.onDropSeed,
    );
  }

  destroy() {
    sprout.destroy();
    if (this.onDropSeed) {
      events.actors.pumpkinKid.sync.clear();
      this.onDropSeed = null;
    }
  }
}

export const pumpkinKids = new PumpkinKids();
