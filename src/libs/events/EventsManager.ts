import { SyncHandler } from "./types";

class EventManager<Events extends Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers = new Map<keyof Events, Set<SyncHandler<any>>>();

  on<K extends keyof Events>(
    event: K,
    handler: SyncHandler<Events[K]>,
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler: SyncHandler<Events[K]>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  emit<K extends keyof Events>(event: K, payload?: Events[K]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  once<K extends keyof Events>(
    event: K,
    handler: SyncHandler<Events[K]>,
  ): () => void {
    const wrappedHandler: SyncHandler<Events[K]> = (payload) => {
      handler(payload);
      this.off(event, wrappedHandler);
    };
    return this.on(event, wrappedHandler);
  }

  clear(event?: keyof Events): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

export default EventManager;
