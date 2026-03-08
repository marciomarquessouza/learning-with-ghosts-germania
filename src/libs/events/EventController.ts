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

  constructor(
    private syncBus: SyncEventBus<SyncEvents>,
    private asyncBus: AsyncEventBus<AsyncEvents>,
  ) {}

  addSyncEvent<E extends keyof SyncEvents>(
    event: E,
    callback: (payload: SyncEvents[E]) => void,
  ) {
    this.syncBus.on(event, callback);
  }

  addAsyncEvent<E extends keyof AsyncEvents>(
    event: E,
    callback: (payload: AsyncEvents[E]) => void,
  ) {
    this.asyncBus.on(event, (payload, done) => {
      if (this.asyncEventsMap.has(event)) {
        console.error(`The event "${String(event)}" is currently running`);
        done();
        return;
      }

      this.asyncEventsMap.set(event, done);
      callback(payload);
    });
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
}
