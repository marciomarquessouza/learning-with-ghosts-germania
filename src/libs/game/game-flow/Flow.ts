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
      const cleanup = () => {
        events.interactions.sync.off("interaction/accept", handlers.accept);
        events.interactions.sync.off("interaction/repeat", handlers.repeat);
        events.interactions.sync.off("interaction/cancel", handlers.cancel);
      };

      const createHandler = (
        option?: {
          callback?: () => void;
          resolvePromise?: boolean;
        },
        shouldResolve = false,
      ) => {
        return ({ id }: { id: string }) => {
          if (id !== this.flowName) return;

          option?.callback?.();

          if (shouldResolve || option?.resolvePromise) {
            cleanup();
            resolve();
          }
        };
      };

      const handlers = {
        accept: createHandler(options?.accept, true),
        repeat: createHandler(options?.repeat),
        cancel: createHandler(options?.cancel),
      };

      events.interactions.sync.on("interaction/accept", handlers.accept);
      events.interactions.sync.on("interaction/repeat", handlers.repeat);
      events.interactions.sync.on("interaction/cancel", handlers.cancel);
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
