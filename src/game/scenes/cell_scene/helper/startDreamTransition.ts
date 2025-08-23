export function startDreamTransition(
  scene: Phaser.Scene,
  afterClose?: () => void
) {
  const camera = scene.cameras.main;

  const transition = scene.add.graphics().setDepth(9999);
  transition.fillStyle(0x000000, 0.0);
  transition.fillRect(0, 0, camera.width, camera.height);

  camera.zoomTo(1.08, 1200, "Sine.easeInOut");
  camera.fade(1200, 0, 0, 0);

  camera.once("camerafadeoutcomplete", () => {
    camera.flash(120, 180, 0, 0);
    afterClose?.();
  });
}
