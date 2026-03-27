import { Vector4 } from "@/utils/vectors";

export interface SelectableAreaConfig {
  bounds: Vector4;
  disabled?: boolean;
  enableDebug?: boolean;
  onClick: () => void;
  onHover?: () => void;
  onPointerOut?: () => void;
}

export class SelectableArea {
  public container: Phaser.GameObjects.Container;
  public disabled: boolean;

  private debugArea: Phaser.GameObjects.Rectangle;
  private onClick: () => void;
  private onHover?: () => void;
  private onPointerOut?: () => void;

  constructor(
    scene: Phaser.Scene,
    {
      bounds,
      disabled = false,
      enableDebug = false,
      onClick,
      onHover,
      onPointerOut,
    }: SelectableAreaConfig,
  ) {
    const { x, y, width, height } = bounds;

    this.disabled = disabled;
    this.onClick = onClick;
    this.onHover = onHover;
    this.onPointerOut = onPointerOut;

    this.debugArea = scene.add
      .rectangle(0, 0, width, height, 0x00ff00)
      .setOrigin(0.5, 0.5)
      .setAlpha(0.5)
      .setVisible(enableDebug);

    this.container = scene.add.container(x + width / 2, y + height / 2, [
      this.debugArea,
    ]);

    this.container.setSize(width, height);
    this.container.setInteractive({ useHandCursor: true });

    this.bindEvents();
  }

  private bindEvents() {
    this.container.on("pointerdown", () => {
      if (this.disabled) return;
      this.onClick();
    });

    this.container.on("pointerover", () => {
      if (this.disabled) return;
      this.onHover?.();
    });

    this.container.on("pointerout", () => {
      if (this.disabled) return;
      this.onPointerOut?.();
    });
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
    return this;
  }

  setDebugVisible(visible: boolean) {
    this.debugArea.setVisible(visible);
    return this;
  }

  destroy() {
    this.container.destroy(true);
  }
}
