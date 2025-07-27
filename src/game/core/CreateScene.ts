/* eslint-disable @typescript-eslint/no-explicit-any */
import { sceneManager } from "./SceneManager";

export function createScene<T extends new (...args: any[]) => Phaser.Scene>(
  SceneClass: T
): Phaser.Scene {
  const Scene = class extends SceneClass {
    create(...args: any[]) {
      // Initialize the scene manager with the current scene
      sceneManager.setScene(this);
      console.log(`Scene ${this.scene.key} created.`);
      /**
       * Any additional setup for the scene can be done here.
       */
      //@ts-expect-error The typescript fix is super complex, so we ignore it here
      if (super.create) {
        //@ts-expect-error The typescript fix is super complex, so we ignore it here
        super.create(...args);
      }
    }
  };
  return new Scene() as Phaser.Scene;
}
