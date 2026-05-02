import { events } from "@/events/events";
import { FlowPayload, FlowResult } from "./types";
import { Step } from "./runSteps";

export abstract class Flow<TState extends string, TGameScene> {
  protected scene: Phaser.Scene;
  protected gameScene: TGameScene;

  abstract flowName: string;

  constructor({ scene, gameScene }: FlowPayload<TGameScene>) {
    this.scene = scene;
    this.gameScene = gameScene;
  }

  abstract run(): Promise<FlowResult<TState, TGameScene>>;

  protected waitInteractionEvent(callback?: () => void): Promise<void> {
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

  protected delay(ms: number, callback?: () => void): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        callback?.();
        resolve();
      }, ms);
    });
  }

  protected repeatSteps(
    repetitions: number,
    createSteps: (index: number) => Step[],
  ): Step[] {
    return Array.from({ length: repetitions }).flatMap((_, index) => {
      return createSteps(index);
    });
  }

  abstract destroy(): void;
}
