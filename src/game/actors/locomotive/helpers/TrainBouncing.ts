class TrainBouncing {
  /**
   * For more bounce:
   *  baseY - 2 → baseY - 3 and 0.35° → 0.5°
   * 
   *  For a “heavier” (slower) response:
   *  duration: 140 → 200 or 240

   *  Less “engine vibration”:
   *  decrease ampY1/ampY2/ampR or remove the jitter block.
   * @param scene 
   * @param target 
   * @param options 
   */

  addBouncing(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.Container,
    options: { baseY: number; baseRotation: number }
  ) {
    const { baseY, baseRotation } = options;
    target.y = baseY;
    target.rotation = baseRotation;
    scene.tweens.add({
      targets: target,
      y: { from: baseY, to: baseY - 2 },
      rotation: {
        from: baseRotation,
        to: baseRotation + Phaser.Math.DegToRad(0.35),
      },
      duration: 140,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: Phaser.Math.Between(10, 35),
    });

    const jitter = {
      t: 0,
      ampY1: 0.6, // px
      ampY2: 0.25, // px
      ampR: Phaser.Math.DegToRad(0.08),
      f1: 10.5, // Hz-ish
      f2: 17.0,
      fR: 8.0,
    };

    scene.events.on("update", (_time: number, delta: number) => {
      if (!target.scene) return;

      jitter.t += delta / 1000;

      const yJ =
        Math.sin(jitter.t * Math.PI * 2 * jitter.f1) * jitter.ampY1 +
        Math.sin(jitter.t * Math.PI * 2 * jitter.f2) * jitter.ampY2;

      const rJ = Math.sin(jitter.t * Math.PI * 2 * jitter.fR) * jitter.ampR;

      target.y = target.y - 0 + yJ; // "delta" leve em cima do tween
      target.rotation = target.rotation - 0 + rJ;
    });

    target.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.events.off("update");
    });
  }
}

export const trainBouncing = new TrainBouncing();
