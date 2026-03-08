import { ElizaEvents } from "@/events/actors/eliza/events";
import { events } from "@/events/events";

export function addElizaAsyncEvent<E extends keyof ElizaEvents>(
  event: E,
  asyncEventsMap: Map<keyof ElizaEvents, () => void>,
  callback: (payload: ElizaEvents[E]) => void,
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
