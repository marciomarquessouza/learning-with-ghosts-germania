import AsyncEventManager from "./AsyncEventManager";
import EventManager from "./EventsManager";

export type EventModule<
  SyncEvents extends Record<string, unknown>,
  AsyncEvents extends Record<string, unknown>,
> = {
  sync: EventManager<SyncEvents>;
  async: AsyncEventManager<AsyncEvents>;
};

export function createEventManagers<
  SyncEvents extends Record<string, unknown>,
  AsyncEvents extends Record<string, unknown>,
>(): EventModule<SyncEvents, AsyncEvents> {
  return {
    sync: new EventManager<SyncEvents>(),
    async: new AsyncEventManager<AsyncEvents>(),
  };
}
