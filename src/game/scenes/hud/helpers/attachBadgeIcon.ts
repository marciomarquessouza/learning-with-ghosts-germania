type BadgeOptions = {
  radius?: number;
  offsetX?: number;
  offsetY?: number;
  backgroundColor?: number;
  strokeColor?: number;
  strokeWidth?: number;
  textColor?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  capAt99?: boolean;
};

export function attachBadgeToIcon(
  scene: Phaser.Scene,
  iconImage: Phaser.GameObjects.Image,
  initialCount = 0,
  opts: BadgeOptions = {}
) {
  const {
    radius,
    offsetX = 6,
    offsetY = -6,
    backgroundColor = 0xd0021b,
    strokeColor = 0xffffff,
    strokeWidth = 1.5,
    textColor = "#ffffff",
    fontFamily = "sans-serif",
    fontWeight = "700",
    fontSize,
    capAt99 = true,
  } = opts;

  const parent =
    iconImage.parentContainer as Phaser.GameObjects.Container | null;
  const container = scene.add.container(iconImage.x, iconImage.y);
  iconImage.setPosition(0, 0);
  if (parent) {
    parent.add(container);
  } else {
    scene.add.existing(container);
  }
  container.add(iconImage);

  const computedRadius =
    radius ??
    Math.max(
      10,
      Math.round(
        Math.min(iconImage.displayWidth, iconImage.displayHeight) * 0.18
      )
    );

  const computedFontSize = fontSize ?? Math.round(computedRadius * 1.15);

  const badgeGfx = scene.add.graphics();
  const badgeText = scene.add.text(0, 0, "", {
    fontFamily,
    fontSize: `${computedFontSize}px`,
    color: textColor,
    fontStyle: fontWeight,
  });
  badgeText.setOrigin(0.5);

  container.add([badgeGfx, badgeText]);

  function setCount(count: number) {
    const label = capAt99 && count >= 100 ? "99+" : String(count);

    const localX = iconImage.displayWidth / 2 + offsetX;
    const localY = -iconImage.displayHeight / 2 + offsetY;

    const digits = label.length;
    const pad =
      digits === 1
        ? 0
        : digits === 2
        ? computedRadius * 0.2
        : computedRadius * 0.45;

    badgeGfx.clear();
    badgeGfx.fillStyle(backgroundColor, 1);
    badgeGfx.lineStyle(strokeWidth, strokeColor, strokeWidth > 0 ? 1 : 0);

    if (digits <= 1) {
      badgeGfx.fillCircle(localX, localY, computedRadius);
      if (strokeWidth > 0)
        badgeGfx.strokeCircle(localX, localY, computedRadius);
      badgeText.setPosition(localX, localY);
    } else {
      const w = computedRadius * 2 + pad * 2;
      const h = computedRadius * 2;
      const left = localX - w / 2;
      const top = localY - h / 2;
      const r = computedRadius;

      badgeGfx.fillRoundedRect(left, top, w, h, r);
      if (strokeWidth > 0) badgeGfx.strokeRoundedRect(left, top, w, h, r);
      badgeText.setPosition(localX, localY);
    }

    badgeText.setText(label);

    if (count <= 0) {
      badgeGfx.setVisible(false);
      badgeText.setVisible(false);
    } else {
      badgeGfx.setVisible(true);
      badgeText.setVisible(true);
    }
  }

  function show() {
    badgeGfx.setVisible(true);
    badgeText.setVisible(true);
  }

  function hide() {
    badgeGfx.setVisible(false);
    badgeText.setVisible(false);
  }

  function destroy() {
    badgeGfx.destroy();
    badgeText.destroy();
  }

  setCount(initialCount);

  return { container, setCount, show, hide, destroy };
}
