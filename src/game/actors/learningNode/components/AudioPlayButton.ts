import {
  AUDIO_PLAY_BUTTON_IMG,
  AUDIO_PLAY_BUTTON_JSON,
} from "@/constants/images";
import { getRequired } from "@/utils/getRequired";
import Phaser from "phaser";

type AttachPosition = "top" | "bottom" | "left" | "right";

type Callback = () => void;

export class AudioPlayButton {
  private static readonly TEXTURE_KEY = "play_button_spritesheet";

  private _button?: Phaser.GameObjects.Sprite;
  private _scene?: Phaser.Scene;
  private _buttonTween?: Phaser.Tweens.Tween;

  public isPlaying = false;

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
      AudioPlayButton.TEXTURE_KEY,
      AUDIO_PLAY_BUTTON_IMG,
      AUDIO_PLAY_BUTTON_JSON,
    );
  }

  create(scene: Phaser.Scene) {
    this._scene = scene;

    this._button = scene.add.sprite(
      0,
      0,
      AudioPlayButton.TEXTURE_KEY,
      "play_button_0",
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

    this.button.setOrigin(0.5);
    this.button.setInteractive({ useHandCursor: true });
  }

  setVisible(option: boolean) {
    this.button?.setVisible(option);
  }

  play(onClick?: Callback) {
    this.buttonTween.stop();
    this.isPlaying = true;

    this.button.setFrame("play_button_1");
    this.button.disableInteractive();
    this.button.setAlpha(1);
    this.button.setScale(1);

    onClick?.();
  }

  stop(callback?: Callback) {
    if (!this.button) return;

    this.isPlaying = false;

    this.button.setFrame("play_button_0");
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
    this.buttonTween.resume();

    this.button.on("pointerover", () => {
      this.buttonTween.stop();
      this.scene?.input.setDefaultCursor("pointer");
    });

    this.button.on("pointerout", () => {
      this.buttonTween.resume();
      this.scene?.input.setDefaultCursor("default");
    });

    this.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      this.play(onClick);
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
    this.isPlaying = false;
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
