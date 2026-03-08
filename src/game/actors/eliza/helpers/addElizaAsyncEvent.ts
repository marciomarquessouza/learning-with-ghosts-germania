import { ElizaAsyncEvents } from "@/events/actors/eliza/events";
import { events } from "@/events/events";

export function addElizaAsyncEvent<E extends keyof ElizaAsyncEvents>(
  event: E,
  asyncEventsMap: Map<keyof ElizaAsyncEvents, () => void>,
  callback: (payload: ElizaAsyncEvents[E]) => void,
) {
  events.actors.eliza.async.on(event, (payload, done) => {
    if (asyncEventsMap.has(event)) {
      console.error(`The event ${String(event)} is currently running`);
      done();
      return;
    }

    asyncEventsMap.set(event, done);
    callback(payload);
  });
}
