import Phaser from "phaser";

type TypeTextConfig = {
  text: string;
  speed?: number;
  onComplete?: () => void;
};

type AttachPosition = "top" | "bottom" | "left" | "right";

export type AttachTarget =
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Sprite
  | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type AttachOptions = {
  position?: AttachPosition;
  offset?: number;
};

export class LessonTargetLabel {
  private container?: Phaser.GameObjects.Container;
  private background?: Phaser.GameObjects.Graphics;
  private badgeBackground?: Phaser.GameObjects.Graphics;
  private badgeText?: Phaser.GameObjects.Text;
  private mainText?: Phaser.GameObjects.Text;
  private typingEvent?: Phaser.Time.TimerEvent;

  private scene?: Phaser.Scene;

  private text = "";
  private badge = "0x";

  private readonly height = 42;
  private readonly badgeWidth = 48;
  private readonly paddingX = 22;
  private readonly radius = 0;

  create(scene: Phaser.Scene) {
    this.scene = scene;

    this.container = scene.add.container(0, 0);

    this.background = scene.add.graphics();
    this.badgeBackground = scene.add.graphics();

    this.badgeText = scene.add.text(0, 0, this.badge, {
      fontFamily: "SpecialElite",
      fontSize: "20px",
      color: "#FFEFDE",
    });

    this.mainText = scene.add.text(0, 0, this.text, {
      fontFamily: "JosefinSans",
      fontSize: "24px",
      color: "#000000",
    });

    this.badgeText.setOrigin(0.5);
    this.mainText.setOrigin(0, 0.5);

    this.container.add([
      this.background,
      this.badgeBackground,
      this.badgeText,
      this.mainText,
    ]);

    this.render();
  }

  setText(text: string) {
    this.text = text;
    this.mainText?.setText(text);
    this.render();
  }

  typeText({ text, speed = 60, onComplete }: TypeTextConfig) {
    if (!this.scene || !this.mainText) return;

    this.typingEvent?.remove(false);

    this.text = text;
    this.mainText.setText("");
    this.render();

    let index = 0;

    this.typingEvent = this.scene.time.addEvent({
      delay: speed,
      repeat: text.length - 1,
      callback: () => {
        index += 1;

        this.mainText?.setText(text.slice(0, index));
        this.render();

        if (index >= text.length) {
          this.typingEvent = undefined;
          onComplete?.();
        }
      },
    });
  }

  setBadge(text: string) {
    this.badge = text;
    this.badgeText?.setText(text);
    this.render();
  }

  setVisible(visible: boolean) {
    this.container?.setVisible(visible);
  }

  attach(target: AttachTarget, options?: AttachOptions) {
    if (!this.container) return;

    const targetBounds = target.getBounds();
    const nodeBounds = this.getBounds();
    const position = options?.position || "top";
    const offset = options?.offset || 0;

    switch (position) {
      case "top":
        this.container.setPosition(
          targetBounds.centerX - nodeBounds.width / 2,
          targetBounds.y - nodeBounds.height - offset,
        );
        break;

      case "bottom":
        this.container.setPosition(
          targetBounds.centerX - nodeBounds.width / 2,
          targetBounds.bottom + offset,
        );
        break;

      case "left":
        this.container.setPosition(
          targetBounds.x - nodeBounds.width - offset,
          targetBounds.centerY - nodeBounds.height / 2,
        );
        break;

      case "right":
        this.container.setPosition(
          targetBounds.right + offset,
          targetBounds.centerY - nodeBounds.height / 2,
        );
        break;
    }
  }

  getGameObject() {
    return this.container;
  }

  destroy() {
    this.container?.destroy(true);

    this.container = undefined;
    this.background = undefined;
    this.badgeBackground = undefined;
    this.badgeText = undefined;
    this.mainText = undefined;
    this.scene = undefined;
  }

  private render() {
    if (
      !this.background ||
      !this.badgeBackground ||
      !this.badgeText ||
      !this.mainText
    ) {
      return;
    }

    const mainTextWidth = this.mainText.width;
    const width = this.badgeWidth + this.paddingX * 2 + mainTextWidth;

    this.background.clear();
    this.background.fillStyle(0xffefde, 1);
    this.background.fillRoundedRect(0, 0, width, this.height, this.radius);

    this.badgeBackground.clear();
    this.badgeBackground.fillStyle(0xfca30e, 1);
    this.badgeBackground.fillRoundedRect(
      0,
      0,
      this.badgeWidth,
      this.height,
      this.radius,
    );

    this.badgeText.setPosition(this.badgeWidth / 2, this.height / 2);

    this.mainText.setPosition(this.badgeWidth + this.paddingX, this.height / 2);

    this.container?.setSize(width, this.height);
  }

  private getBounds(): Phaser.Geom.Rectangle {
    if (!this.container) {
      return new Phaser.Geom.Rectangle(0, 0, 0, 0);
    }

    return this.container.getBounds();
  }
}
