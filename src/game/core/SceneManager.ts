import { gameEvents, TransitionOptions } from "../../events";

/**
 * SceneManager is a singleton class that manages the current scene.
 */
class SceneManager {
  private currentScene: Phaser.Scene | null = null;

  constructor() {
    this.initSceneEvents();
  }

  private initSceneEvents() {
    gameEvents.on("change-scene", ({ targetScene, fade, options }) => {
      this.changeScene(targetScene, fade, options);
    });
  }

  public setScene(scene: Phaser.Scene): void {
    this.currentScene = scene;
  }

  public changeScene(
    targetScene: string,
    fade = false,
    transition: TransitionOptions = {}
  ): void {
    if (!this.currentScene) {
      console.warn("No current scene to change from.");
      return;
    }
    if (this.currentScene.scene.isActive(targetScene)) {
      console.warn(`Scene ${targetScene} is already active.`);
      return;
    }

    if (fade) {
      this.currentScene.scene.transition({
        target: targetScene,
        duration: transition.duration || 500,
        ...transition,
      });
      return;
    }

    this.currentScene.scene.start(targetScene);
  }
}

export const sceneManager = new SceneManager();
