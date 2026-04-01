import { FlowPayload, FlowResult } from "./types";

export abstract class Flow<TState extends string, TGameScene> {
  protected scene: Phaser.Scene;
  protected gameScene: TGameScene;

  abstract flowName: string;

  constructor({ scene, gameScene }: FlowPayload<TGameScene>) {
    this.scene = scene;
    this.gameScene = gameScene;
  }

  abstract run(): Promise<FlowResult<TState, TGameScene>>;

  abstract destroy(): void;
}
