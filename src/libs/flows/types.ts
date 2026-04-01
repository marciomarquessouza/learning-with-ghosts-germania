import { Flow } from "./Flow";

export type FlowPayload<TGameScene> = {
  scene: Phaser.Scene;
  gameScene: TGameScene;
};

export type FlowClass<TState extends string, TGameScene> = new (
  deps: FlowPayload<TGameScene>,
) => Flow<TState, TGameScene>;

export type FlowResult<TState extends string, TGameScene> = {
  nextState?: TState;
  nextFlow?: FlowClass<TState, TGameScene>;
  cancelFlow?: new (deps: FlowPayload<TGameScene>) => Flow<TState, TGameScene>;
};
