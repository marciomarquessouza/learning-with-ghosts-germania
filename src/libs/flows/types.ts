import { Flow } from "./Flow";

export type FlowPayload<TGameScene> = {
  scene: Phaser.Scene;
  gameScene: TGameScene;
};

export type FlowClass<TState extends string, TGameScene> = new (
  deps: FlowPayload<TGameScene>,
) => Flow<TState, TGameScene>;

export type ScheduledFlow<TState extends string, TGameScene> = {
  id: string;
  mode: "parallel" | "queue";
  delayMs: number;
  FlowClass: FlowClass<TState, TGameScene>;
};

export type FlowResult<TState extends string, TGameScene> = {
  nextState?: TState;
  nextFlow?: FlowClass<TState, TGameScene>;
  cancelFlow?: FlowClass<TState, TGameScene>;
  scheduledFlows?: ScheduledFlow<TState, TGameScene>[];
};
