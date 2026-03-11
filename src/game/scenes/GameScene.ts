import { ActorRegistry } from "@/libs/game/actor-registry/ActorRegistry";
import { GameActors } from "@/types";

export class GameScene extends Phaser.Scene {
  public actors = new ActorRegistry<GameActors>();
}
