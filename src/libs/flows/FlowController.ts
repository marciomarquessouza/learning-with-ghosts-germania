import { Flow } from "./Flow";
import { FlowClass, FlowPayload, FlowResult } from "./types";

export class FlowController<TState extends string, TGameScene> {
  private scene: Phaser.Scene;
  private gameScene: TGameScene;
  private currentFlow?: Flow<TState, TGameScene>;

  constructor({ scene, gameScene }: FlowPayload<TGameScene>) {
    this.scene = scene;
    this.gameScene = gameScene;
  }

  async run(
    FlowClass: FlowClass<TState, TGameScene>,
  ): Promise<FlowResult<TState, TGameScene>> {
    const flow = new FlowClass({
      scene: this.scene,
      gameScene: this.gameScene,
    });

    this.currentFlow = flow;

    const result: FlowResult<TState, TGameScene> = await flow.run();

    if (this.currentFlow === flow) {
      this.currentFlow = undefined;
    }

    return result;
  }

  getCurrentFlow() {
    return this.currentFlow;
  }
}
