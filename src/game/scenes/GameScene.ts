import { ActorRegistry } from "@/libs/game/actor-registry/ActorRegistry";
import { GameActors } from "@/types";

export class GameScene extends Phaser.Scene {
  public actors = new ActorRegistry<GameActors>();

  protected createActor<K extends keyof GameActors, A extends unknown[]>(
    name: K,
    ActorClass: new (...args: A) => GameActors[K],
    ...args: A
  ): GameActors[K] {
    return this.actors.create(name, ActorClass, ...args);
  }
}
