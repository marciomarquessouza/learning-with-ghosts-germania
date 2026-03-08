import { AsyncHandler, ClearEvent } from "./types";

class AsyncEventManager<Events extends Record<string, unknown>> {
  private handlers = new Map<
    keyof Events,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<AsyncHandler<any>, (data: any) => void>
  >();
  private pendingEvents = new Set<keyof Events>();

  on<K extends keyof Events>(
    event: K,
    handler: AsyncHandler<Events[K]>,
  ): ClearEvent {
    const wrapper = (eventData: { data: Events[K]; done: () => void }) => {
      Promise.resolve(handler(eventData.data, eventData.done)).catch(
        (error) => {
          console.error(`Error in asynchronous event ${String(event)}:`, error);
          eventData.done();
        },
      );
    };

    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Map());
    }

    this.handlers.get(event)!.set(handler, wrapper);

    return {
      remove: () => this.off(event, handler),
    };
  }

  off<K extends keyof Events>(
    event: K,
    handler: AsyncHandler<Events[K]>,
  ): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  async emitAsync<K extends keyof Events>(
    event: K,
    data?: Events[K],
  ): Promise<void> {
    return new Promise((resolve) => {
      const eventHandlers = this.handlers.get(event);

      if (!eventHandlers || eventHandlers.size === 0) {
        resolve();
        return;
      }

      let pending = eventHandlers.size;
      this.pendingEvents.add(event);

      const done = () => {
        pending--;
        if (pending === 0) {
          this.pendingEvents.delete(event);
          resolve();
        }
      };

      eventHandlers.forEach((wrapper) => {
        wrapper({ data, done });
      });
    });
  }

  once<K extends keyof Events>(
    event: K,
    handler: AsyncHandler<Events[K]>,
  ): ClearEvent {
    const wrappedHandler: AsyncHandler<Events[K]> = (data, done) => {
      handler(data, done);
      this.off(event, wrappedHandler);
    };
    return this.on(event, wrappedHandler);
  }

  clear<K extends keyof Events>(event?: K): void {
    if (event) {
      this.handlers.delete(event);
      this.pendingEvents.delete(event);
    } else {
      this.handlers.clear();
      this.pendingEvents.clear();
    }
  }

  isPending<K extends keyof Events>(event: K): boolean {
    return this.pendingEvents.has(event);
  }

  hasEvent<K extends keyof Events>(event: K): boolean {
    return this.handlers.has(event) && this.handlers.get(event)!.size > 0;
  }

  getHandlerCount<K extends keyof Events>(event: K): number {
    return this.handlers.get(event)?.size || 0;
  }
}

export default AsyncEventManager;
