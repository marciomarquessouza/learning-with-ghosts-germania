import { SPRITESHEETS } from "@/constants/spritesheets";

type AttachActorOptions = {
  x?: number;
  y?: number;
};

export class FloorAnimations {
  private static readonly OPEN_ANIMATION_KEY =
    "learningNode_floor_transition_open";

  private _container?: Phaser.GameObjects.Container;

  private _openingSprite?: Phaser.GameObjects.Sprite;
  private _baseSprite?: Phaser.GameObjects.Sprite;
  private _frontSprite?: Phaser.GameObjects.Sprite;

  private get container(): Phaser.GameObjects.Container {
    if (!this._container) {
      throw new Error("FloorAnimations - container was not initialized");
    }

    return this._container;
  }

  private get openingSprite(): Phaser.GameObjects.Sprite {
    if (!this._openingSprite) {
      throw new Error("FloorAnimations - opening sprite was not initialized");
    }

    return this._openingSprite;
  }

  private get baseSprite(): Phaser.GameObjects.Sprite {
    if (!this._baseSprite) {
      throw new Error("FloorAnimations - base sprite was not initialized");
    }

    return this._baseSprite;
  }

  private get frontSprite(): Phaser.GameObjects.Sprite {
    if (!this._frontSprite) {
      throw new Error("FloorAnimations - front sprite was not initialized");
    }

    return this._frontSprite;
  }

  private get textureKey(): string {
    return SPRITESHEETS.learningNode.floor_transition.key;
  }

  private getFrameName(frame: number): string {
    return `learningNode_floor_transition_${frame}`;
  }

  preload(scene: Phaser.Scene) {
    const floorSpritesheet = SPRITESHEETS.learningNode.floor_transition;
    const load: Phaser.Loader.LoaderPlugin = scene.load;

    load.atlas(
      floorSpritesheet.key,
      floorSpritesheet.image,
      floorSpritesheet.atlas,
    );
  }

  create(scene: Phaser.Scene, container: Phaser.GameObjects.Container) {
    this._container = container;

    this.createOpenAnimation(scene);

    this._baseSprite = scene.add
      .sprite(0, 0, this.textureKey, this.getFrameName(11))
      .setOrigin(0)
      .setVisible(false);

    this._openingSprite = scene.add
      .sprite(0, 0, this.textureKey, this.getFrameName(0))
      .setOrigin(0)
      .setVisible(false);

    this._frontSprite = scene.add
      .sprite(0, 0, this.textureKey, this.getFrameName(12))
      .setOrigin(0)
      .setVisible(false);

    container.add(this.baseSprite);
    container.add(this.openingSprite);
    container.add(this.frontSprite);
  }

  private createOpenAnimation(scene: Phaser.Scene) {
    if (scene.anims.exists(FloorAnimations.OPEN_ANIMATION_KEY)) {
      return;
    }

    scene.anims.create({
      key: FloorAnimations.OPEN_ANIMATION_KEY,
      frames: scene.anims.generateFrameNames(this.textureKey, {
        prefix: "learningNode_floor_transition_",
        start: 0,
        end: 10,
      }),
      frameRate: 12,
      repeat: 0,
    });
  }

  async playOpen(): Promise<void> {
    this.baseSprite.setVisible(false);
    this.frontSprite.setVisible(false);

    this.openingSprite.setFrame(this.getFrameName(0)).setVisible(true);

    return new Promise((resolve) => {
      this.openingSprite.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          this.openingSprite.setVisible(false);

          this.baseSprite.setVisible(true);
          this.frontSprite.setVisible(true);

          resolve();
        },
      );

      this.openingSprite.play(FloorAnimations.OPEN_ANIMATION_KEY);
    });
  }

  attachActor(
    actor: Phaser.GameObjects.GameObject,
    options: AttachActorOptions = {},
  ) {
    const { x, y } = options;

    if ("setPosition" in actor && typeof actor.setPosition === "function") {
      actor.setPosition(x ?? 0, y ?? 0);
    }

    const currentIndex = this.container.getIndex(actor);

    if (currentIndex !== -1) {
      this.container.remove(actor, false);
    }

    const frontSpriteIndex = this.container.getIndex(this.frontSprite);

    this.container.addAt(actor, frontSpriteIndex);
  }

  destroy() {
    this._openingSprite?.destroy();
    this._baseSprite?.destroy();
    this._frontSprite?.destroy();

    this._openingSprite = undefined;
    this._baseSprite = undefined;
    this._frontSprite = undefined;
    this._container = undefined;
  }
}
