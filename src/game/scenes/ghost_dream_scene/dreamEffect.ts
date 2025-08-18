const CEMETERY = "cemetery";

// TODO: finish background
class BackgroundDreamEffect {
  preload(scene: Phaser.Scene): void {
    // add preloads
  }

  create(scene: Phaser.Scene): void {
    const background = scene.add
      .sprite(0, 0, CEMETERY)
      .setOrigin(0, 0)
      .setDepth(-100);
    background.setScrollFactor(0);

    scene.anims.create({
      key: "cem_ripple",
      frames: [
        { key: "cem1" },
        { key: "cem2" },
        { key: "cem3" },
        { key: "cem4" },
      ],
      frameRate: 3, // 2–3 fps fica onírico
      repeat: -1,
      yoyo: true, // sequência: 1,2,3,4,3,2,...
    });

    background.play("cem_ripple");
  }
}

export const dreamEffect = new BackgroundDreamEffect();
