import { events } from "@/events/events";

const FADE_COLOR = { r: 0, g: 0, b: 0 };

interface FadeProps {
  duration?: number;
}

export class GameCamera {
  public mainCamera!: Phaser.Cameras.Scene2D.Camera;
  private removeZoomListener?: () => void;
  private scene!: Phaser.Scene;

  private get camera() {
    if (!this.mainCamera) {
      throw new Error("GameCamera has not been created yet.");
    }

    return this.mainCamera;
  }

  create(scene: Phaser.Scene) {
    this.scene = scene;
    this.mainCamera = scene.cameras.main;
    this.mainCamera.setBackgroundColor(0x000000);

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

  setBounds(x: number, y: number, width: number, height: number) {
    this.camera.setBounds(x, y, width, height);
  }

  attachTarget(target: Phaser.Physics.Arcade.Sprite) {
    this.camera.startFollow(target, true, 0.12, 0.12);
  }

  async fadeIn({ duration }: FadeProps): Promise<void> {
    return new Promise((resolve) => {
      this.camera.fadeIn(
        duration ?? 0,
        FADE_COLOR.r,
        FADE_COLOR.g,
        FADE_COLOR.b,
      );

      this.camera.once("camerafadeincomplete", () => {
        resolve();
      });
    });
  }

  async fadeOut({ duration }: FadeProps): Promise<void> {
    return new Promise((resolve) => {
      this.mainCamera.fadeOut(
        duration ?? 0,
        FADE_COLOR.r,
        FADE_COLOR.g,
        FADE_COLOR.b,
      );

      this.camera.once("camerafadeoutcomplete", () => {
        resolve();
      });
    });
  }

  async changeWorldTransition(): Promise<void> {
    return new Promise((resolve) => {
      const transition = this.scene.add.graphics().setDepth(9999);
      transition.fillStyle(0x000000, 0.0);
      transition.fillRect(0, 0, this.camera.width, this.camera.height);

      this.camera.zoomTo(1.08, 1200, "Sine.easeInOut");
      this.camera.fade(1200, 0, 0, 0);

      this.camera.once("camerafadeoutcomplete", () => {
        this.camera.flash(120, 180, 0, 0);
        resolve();
      });
    });
  }

  destroy() {
    this.removeZoomListener?.();
    this.removeZoomListener = undefined;
  }
}
