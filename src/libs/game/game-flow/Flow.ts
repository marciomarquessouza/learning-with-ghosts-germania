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

  protected waitInteractionEvent(
    callbackAccept?: () => void,
    callbackCancel?: () => void,
  ): Promise<void> {
    return new Promise((resolve) => {
      const handlerAccept = ({ id }: { id: string }) => {
        if (id !== this.flowName) return;

        callbackAccept?.();
        events.interactions.sync.off("interaction/accept", handlerAccept);
        resolve();
      };

      const handlerCancel = ({ id }: { id: string }) => {
        if (id !== this.flowName) return;

        callbackCancel?.();
        events.interactions.sync.off("interaction/cancel", handlerAccept);
        resolve();
      };

      events.interactions.sync.on("interaction/accept", handlerAccept);
      events.interactions.sync.on("interaction/cancel", handlerCancel);
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
