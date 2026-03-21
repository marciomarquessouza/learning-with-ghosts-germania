import { events } from "@/events/events";

export function showDreamIntroduction(): Promise<void> {
  return events.scenes.dream.async.emitAsync("dream/show-introduction", {});
}
