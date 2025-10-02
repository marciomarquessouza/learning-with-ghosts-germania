import { gameEvents } from "@/events/gameEvents";
import { Vector4 } from "@/utils/vectors";

const FADE_IN_DURATION = 1500;
const FADE_COLOR = { r: 0, g: 0, b: 0 };

export class DreamCamera {
  public mainCamera!: Phaser.Cameras.Scene2D.Camera;

  create(
    scene: Phaser.Scene,
    target: Phaser.Physics.Arcade.Sprite,
    bounds: Vector4
  ) {
    this.mainCamera = scene.cameras.main;
    this.mainCamera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    this.mainCamera.startFollow(target, true, 0.12, 0.12);
    this.mainCamera.setBackgroundColor(0x000000);
    gameEvents.on("camera-zoom-to", ({ zoom, duration = 0 }) => {
      this.mainCamera.zoomTo(zoom, duration);
    });
  }

  fadeIn({ onComplete }: { onComplete: () => void }) {
    this.mainCamera.fadeIn(
      FADE_IN_DURATION,
      FADE_COLOR.r,
      FADE_COLOR.g,
      FADE_COLOR.b
    );
    this.mainCamera.once("camerafadeincomplete", () => {
      onComplete();
    });
  }
}

export const dreamCamera = new DreamCamera();
