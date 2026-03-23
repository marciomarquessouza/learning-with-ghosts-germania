import { events } from "@/events/events";

const FADE_IN_DURATION = 1500;
const FADE_COLOR = { r: 0, g: 0, b: 0 };

interface FadeInProps {
  duration?: number;
}

export class DreamCamera {
  public mainCamera!: Phaser.Cameras.Scene2D.Camera;
  private removeZoomListener?: () => void;

  private get camera() {
    if (!this.mainCamera) {
      throw new Error("DreamCamera has not been created yet.");
    }

    return this.mainCamera;
  }

  create(scene: Phaser.Scene) {
    this.mainCamera = scene.cameras.main;
    this.mainCamera.setBackgroundColor(0x000000);
    this.mainCamera.fadeOut(0, FADE_COLOR.r, FADE_COLOR.g, FADE_COLOR.b);

    const zoomHandler = ({
      zoom,
      duration = 0,
    }: {
      zoom: number;
      duration?: number;
    }) => {
      this.camera.zoomTo(zoom, duration);
    };

    events.game.sync.on("camera/zoom-to", zoomHandler);

    this.removeZoomListener = () => {
      events.game.sync.off("camera/zoom-to", zoomHandler);
    };
  }

  destroy() {
    this.removeZoomListener?.();
    this.removeZoomListener = undefined;
  }

  setBounds(x: number, y: number, width: number, height: number) {
    this.camera.setBounds(x, y, width, height);
  }

  attachTarget(target: Phaser.Physics.Arcade.Sprite) {
    this.camera.startFollow(target, true, 0.12, 0.12);
  }

  async fadeIn({ duration }: FadeInProps): Promise<void> {
    return new Promise((resolve) => {
      this.camera.fadeIn(
        duration ?? FADE_IN_DURATION,
        FADE_COLOR.r,
        FADE_COLOR.g,
        FADE_COLOR.b,
      );

      this.camera.once("camerafadeincomplete", () => {
        resolve();
      });
    });
  }
}
