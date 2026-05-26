import {
  AUDIO_RECORD_BUTTON_IMG,
  AUDIO_RECORD_BUTTON_JSON,
} from "@/constants/images";
import { getRequired } from "@/utils/getRequired";

type AttachPosition = "top" | "bottom" | "left" | "right";

type Callback = () => void;

interface AudioRecordButtonOptions {
  target: Phaser.GameObjects.Container | Phaser.GameObjects.Sprite;
  position: AttachPosition;
  offset?: number;
  onStartRecord?: () => void;
  onStopRecord?: () => void;
}

export class AudioRecordButton {
  private static readonly TEXTURE_KEY = "record_button_spritesheet";

  private _button?: Phaser.GameObjects.Sprite;
  private _scene?: Phaser.Scene;
  private _buttonTween?: Phaser.Tweens.Tween;

  public isRecording = false;

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "AudioRecordButton", "_scene");
  }

  private get button(): Phaser.GameObjects.Sprite {
    return getRequired(this._button, "AudioRecordButton", "_button");
  }

  private get buttonTween() {
    return getRequired(this._buttonTween, "AudioRecordButton", "_buttonTween");
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

    this._buttonTween = scene.tweens.add({
      targets: this._button,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      paused: true,
    });

    this._button.setOrigin(0.5);
    this._button.setInteractive({ useHandCursor: true });
  }

  setVisible(option: boolean) {
    this.button.setVisible(option);
  }

  record(onStartRecord?: Callback) {
    this.isRecording = true;

    this.button.setFrame("record_button_1");
    this.button.setAlpha(1);
    this.button.setScale(1);

    onStartRecord?.();
  }

  stop(onStopRecord?: Callback) {
    this.isRecording = false;

    this.button.setFrame("record_button_0");
    this.button.setInteractive({ useHandCursor: true });

    onStopRecord?.();
  }

  attach({
    target,
    position,
    onStartRecord,
    onStopRecord,
    offset = 5,
  }: AudioRecordButtonOptions) {
    this.button.setDepth(100);
    this.buttonTween.resume();

    this.button.on("pointerover", () => {
      this.buttonTween.stop();
      this.button.setScale(1.2);
      this.scene.input.setDefaultCursor("pointer");
    });

    this.button.on("pointerout", () => {
      this.buttonTween.resume();
      this.button.setScale(1);
      this.scene?.input.setDefaultCursor("default");
    });

    this.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (this.isRecording) {
        this.stop(onStopRecord);
        return;
      }
      this.record(onStartRecord);
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
    this._buttonTween = undefined;
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
