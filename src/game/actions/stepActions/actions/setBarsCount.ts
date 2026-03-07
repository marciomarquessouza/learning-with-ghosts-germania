import { events } from "@/events/events";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";

export interface BarsCount {
  count: number;
}

export function setBarsCount({ count }: BarsCount): Promise<void> {
  return events.game.async.emitAsync("hud-actions-badge", {
    icon: ACTIONS_ICONS.BARS,
    count,
  });
}
