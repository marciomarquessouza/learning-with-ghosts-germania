import { gameEvents } from "../gameEvents";

export interface ShowDangerZone {
  amount: number;
}

export function showDangerZone({ amount }: ShowDangerZone): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("krampus/danger", {
      amount,
      onFinish: () => resolve(),
    });
  });
}
