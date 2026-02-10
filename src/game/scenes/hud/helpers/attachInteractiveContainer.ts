type Options = {
  container: Phaser.GameObjects.Container;
  width: number;
  height: number;
  url: string;
};

class AttachInteractiveContainer {
  create(scene: Phaser.Scene, { container, width, height, url }: Options) {
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
    );

    container.on("pointerover", () => {
      scene.input.setDefaultCursor("pointer");
    });

    container.on("pointerout", () => {
      scene.input.setDefaultCursor("default");
    });

    container.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      window.open(url, "_blank");
    });
  }
}

export const attachInteractiveContainer = new AttachInteractiveContainer();
