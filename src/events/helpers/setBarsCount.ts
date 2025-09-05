import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { gameEvents } from "../gameEvents";

export function setBarsCount(count: number): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("hud-actions-badge", {
      icon: ACTIONS_ICONS.BARS,
      count,
    });
    return resolve();
  });
}
