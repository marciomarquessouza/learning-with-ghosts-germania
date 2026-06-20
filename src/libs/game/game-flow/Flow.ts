import { events } from "@/events/events";
import { FlowPayload, FlowResult } from "./types";
import { Step } from "./runSteps";

interface WaitInteractionEventOptions {
  accept?: {
    callback?: () => void;
  };
  cancel?: {
    resolvePromise?: boolean;
    callback?: () => void;
  };
  repeat?: {
    resolvePromise?: boolean;
    callback?: () => void;
  };
}

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
    options?: WaitInteractionEventOptions,
  ): Promise<void> {
    return new Promise((resolve) => {
      const handlerAccept = ({ id }: { id: string }) => {
        if (id !== this.flowName) return;

        options?.accept?.callback?.();
        events.interactions.sync.off("interaction/accept", handlerAccept);
        resolve();
      };

      const handleRepeat = ({ id }: { id: string }) => {
        if (id !== this.flowName) return;

        options?.repeat?.callback?.();
        events.interactions.sync.off("interaction/repeat", handlerAccept);

        if (options?.repeat?.resolvePromise) {
          resolve();
        }
      };

      const handlerCancel = ({ id }: { id: string }) => {
        if (id !== this.flowName) return;

        options?.cancel?.callback?.();
        events.interactions.sync.off("interaction/cancel", handlerAccept);
        if (options?.cancel?.resolvePromise) {
          resolve();
        }
      };

      events.interactions.sync.on("interaction/accept", handlerAccept);
      events.interactions.sync.on("interaction/cancel", handlerCancel);
      events.interactions.sync.on("interaction/repeat", handleRepeat);
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
