import AsyncEventManager from "./AsyncEventManager";
import EventManager from "./EventsManager";

export type EventModule<Events extends Record<string, unknown>> = {
  sync: EventManager<Events>;
  async: AsyncEventManager<Events>;
};

export function createEventManagers<
  Events extends Record<string, unknown>,
>(): EventModule<Events> {
  return {
    sync: new EventManager<Events>(),
    async: new AsyncEventManager<Events>(),
  };
}
