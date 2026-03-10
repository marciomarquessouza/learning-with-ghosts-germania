type EventMap = Record<string, unknown>;

type SyncEventBus<Events extends EventMap> = {
  on<E extends keyof Events>(
    event: E,
    handler: (payload: Events[E]) => void,
  ): void;
};

type AsyncEventBus<Events extends EventMap> = {
  on<E extends keyof Events>(
    event: E,
    handler: (payload: Events[E], done: () => void) => void,
  ): void;
};

export class EventController<
  SyncEvents extends EventMap,
  AsyncEvents extends EventMap,
> {
  private asyncEventsMap = new Map<keyof AsyncEvents, () => void>();
  private removeEvents: Array<() => void> = [];

  constructor(
    private syncBus: SyncEventBus<SyncEvents>,
    private asyncBus: AsyncEventBus<AsyncEvents>,
  ) {}

  addSyncEvent<E extends keyof SyncEvents>(
    event: E,
    callback: (payload: SyncEvents[E]) => void,
  ) {
    const remove = this.syncBus.on(event, callback) as unknown as
      | (() => void)
      | undefined;

    if (remove) {
      this.removeEvents.push(remove);
    }
  }

  addAsyncEvent<E extends keyof AsyncEvents>(
    event: E,
    callback: (payload: AsyncEvents[E]) => void,
  ) {
    const clearEvent = this.asyncBus.on(event, (payload, done) => {
      if (this.asyncEventsMap.has(event)) {
        console.error(`The event "${String(event)}" is currently running`);
        done();
        return;
      }

      this.asyncEventsMap.set(event, done);
      callback(payload);
    }) as unknown as { remove: () => void } | undefined;

    if (clearEvent?.remove) {
      this.removeEvents.push(() => clearEvent.remove());
    }
  }

  closeAsyncEvent<E extends keyof AsyncEvents>(event: E) {
    const done = this.asyncEventsMap.get(event);

    if (!done) {
      console.error(
        `It was not possible to close the event "${String(event)}"`,
      );
      return;
    }

    this.asyncEventsMap.delete(event);
    done();
  }

  offAllEvents() {
    this.removeEvents.forEach((removeEvent) => removeEvent());
    this.removeEvents = [];
    this.asyncEventsMap.clear();
  }
}
