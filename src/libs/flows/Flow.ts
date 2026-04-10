import { events } from "@/events/events";
import { FlowPayload, FlowResult } from "./types";

export abstract class Flow<TState extends string, TGameScene> {
  protected scene: Phaser.Scene;
  protected gameScene: TGameScene;

  abstract flowName: string;

  constructor({ scene, gameScene }: FlowPayload<TGameScene>) {
    this.scene = scene;
    this.gameScene = gameScene;
  }

  public waitInteractionEvent(callback?: () => void): Promise<void> {
    return new Promise((resolve) => {
      const handler = ({ id }: { id: string }) => {
        if (id !== this.flowName) return;

        callback?.();
        events.interactions.sync.off("interaction/accept", handler);
        resolve();
      };

      events.interactions.sync.on("interaction/accept", handler);
    });
  }

  abstract run(): Promise<FlowResult<TState, TGameScene>>;

  abstract destroy(): void;
}
