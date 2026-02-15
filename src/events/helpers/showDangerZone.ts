import { gameEvents } from "../gameEvents";

export interface ReleaseKrampus {
  skyEffectAmount?: number;
}

export function releaseKrampus({
  skyEffectAmount,
}: ReleaseKrampus): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("krampus/released", {
      skyEffectAmount,
      onFinish: () => resolve(),
    });
  });
}
