import {
  AUDIO_RECORD_BUTTON_IMG,
  AUDIO_RECORD_BUTTON_JSON,
} from "@/constants/images";
import { getRequired } from "@/utils/getRequired";

type AttachPosition = "top" | "bottom" | "left" | "right";

type Callback = () => void;

export class AudioRecordButton {
  private static readonly TEXTURE_KEY = "record_button_spritesheet";

  private _button?: Phaser.GameObjects.Sprite;
  private _scene?: Phaser.Scene;

  public isRecording = false;

  private get button(): Phaser.GameObjects.Sprite {
    return getRequired(this._button, "AudioRecordButton", "_button");
  }

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "AudioRecordButton", "_scene");
  }

  preload(scene: Phaser.Scene) {
    scene.load.atlas(
      AudioRecordButton.TEXTURE_KEY,
      AUDIO_RECORD_BUTTON_IMG,
      AUDIO_RECORD_BUTTON_JSON,
    );
  }

  create(scene: Phaser.Scene) {
    this._scene = scene;

    this._button = scene.add.sprite(
      0,
      0,
      AudioRecordButton.TEXTURE_KEY,
      "record_button_0",
    );

    this._button.setOrigin(0.5);
    this._button.setInteractive({ useHandCursor: true });
  }

  setVisible(option: boolean) {
    this.button.setVisible(option);
  }

  record(onClick?: Callback) {
    this.isRecording = true;

    this.button.setFrame("record_button_1");
    this.button.disableInteractive();
    this.button.setAlpha(1);
    this.button.setScale(1);

    onClick?.();
  }

  stop(callback?: Callback) {
    this.isRecording = false;

    this.button.setFrame("record_button_0");
    this.button.setInteractive({ useHandCursor: true });

    callback?.();
  }

  attach({
    target,
    position,
    onClick,
    offset = 5,
  }: {
    target: Phaser.GameObjects.Container | Phaser.GameObjects.Sprite;
    position: AttachPosition;
    onClick?: () => void;
    offset?: number;
  }) {
    this.button.setDepth(100);
    this.button.on("pointerover", () => {
      this.button.setScale(1.2);
      this.scene.input.setDefaultCursor("pointer");
    });

    this.button.on("pointerout", () => {
      this.button.setScale(1);
      this.scene?.input.setDefaultCursor("default");
    });

    this.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      this.record(onClick);
    });

    const bounds = this.getTargetBounds(target);

    switch (position) {
      case "top":
        this.button.setPosition(
          bounds.centerX,
          bounds.y - this.button.displayHeight / 2 - offset,
        );
        break;

      case "bottom":
        this.button.setPosition(
          bounds.centerX,
          bounds.bottom + this.button.displayHeight / 2 + offset,
        );
        break;

      case "left":
        this.button.setPosition(
          bounds.x - this.button.displayWidth / 2 - offset,
          bounds.centerY,
        );
        break;

      case "right":
        this.button.setPosition(
          bounds.right + this.button.displayWidth / 2 + offset,
          bounds.centerY,
        );
        break;
    }
  }

  destroy() {
    this.button.destroy();
    this._button = undefined;
    this._scene = undefined;
    this.isRecording = false;
  }

  private getTargetBounds(
    target:
      | Phaser.GameObjects.Container
      | Phaser.GameObjects.Sprite
      | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ): Phaser.Geom.Rectangle {
    return target.getBounds();
  }
}
