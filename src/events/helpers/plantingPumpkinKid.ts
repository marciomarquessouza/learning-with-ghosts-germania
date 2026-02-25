import { DropSeedEvent, lessonEvents } from "../lessonEvents";

function dropSeed(options: DropSeedEvent) {
  lessonEvents.emit("pumpkin-kid/lesson:drop-seed", options);
}

export function plantingPumpkinKid(): Promise<void> {
  return new Promise((resolve) => {
    lessonEvents.emit("eliza/lesson:sowing", {
      onFinish: () => dropSeed({ onFinish: () => resolve() }),
    });
  });
}
