import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { gameEvents } from "../gameEvents";

export interface BarsCount {
  count: number;
}

export function setBarsCount({ count }: BarsCount): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("hud-actions-badge", {
      icon: ACTIONS_ICONS.BARS,
      count,
    });
    return resolve();
  });
}
