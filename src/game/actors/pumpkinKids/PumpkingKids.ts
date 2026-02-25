import { DropSeedEvent, lessonEvents } from "@/events/lessonEvents";
import { crackAnimation } from "./helpers/crackAnimation";
import { seed } from "./helpers/seed";
import { onAnimationComplete } from "@/utils/animations/onAnimationComplete";

interface CreateOptions {
  scenarioWidth: number;
}

class PumpkinKids {
  private onDropSeed: (({ onFinish }: DropSeedEvent) => void) | null = null;

  preload(scene: Phaser.Scene) {
    crackAnimation.preload(scene);
  }

  create(scene: Phaser.Scene, { scenarioWidth }: CreateOptions) {
    seed.create(scene);
    const positionX = scenarioWidth - 760;
    const handPositionY = 510;
    const groundPositionY = handPositionY + 410;
    const crackSprite = crackAnimation.create(
      scene,
      positionX,
      groundPositionY,
    );

    this.onDropSeed = ({ onFinish }: DropSeedEvent) => {
      seed.dropSeed(scene, {
        x: positionX,
        startY: handPositionY,
        groundY: groundPositionY,
        onImpact: () => {
          const animation = "open";
          crackAnimation.play(animation);
          onAnimationComplete(crackSprite, animation, onFinish);
        },
      });
    };

    lessonEvents.on("pumpkin-kid/lesson:drop-seed", this.onDropSeed);
  }

  destroy() {
    crackAnimation.destroy();
    if (this.onDropSeed) {
      lessonEvents.off("pumpkin-kid/lesson:drop-seed", this.onDropSeed);
      this.onDropSeed = null;
    }
  }
}

export const pumpkinKids = new PumpkinKids();
