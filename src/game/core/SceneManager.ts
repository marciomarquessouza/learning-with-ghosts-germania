import { GameScenes } from "@/types";
import { events } from "@/events/events";

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

/**
 * SceneManager is a singleton class that manages the current scene.
 */
class SceneManager {
  private currentScene: Phaser.Scene | null = null;

  constructor() {
    this.initSceneEvents();
  }

  private initSceneEvents() {
    events.game.async.on("change-scene", (payload, done) => {
      this.changeScene(payload);
      done();
    });
  }

  public setScene(scene: Phaser.Scene): void {
    this.currentScene = scene;
  }

  public changeScene(payload: {
    targetScene: GameScenes;
    fade?: boolean;
    transition?: TransitionOptions;
  }): void {
    const { targetScene, transition = {}, fade = false } = payload;
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
