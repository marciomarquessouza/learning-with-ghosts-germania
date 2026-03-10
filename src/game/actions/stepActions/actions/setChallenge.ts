import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { events } from "@/events/events";

export interface ChallengeEvent {
  countdown: number;
  onFinish: () => void;
}

export function setChallenge({
  countdown,
  onFinish,
}: ChallengeEvent): Promise<void> {
  return events.game.async.emitAsync("hud/actions-timer", {
    icon: ACTIONS_ICONS.CHALLENGE,
    timeInSeconds: countdown,
    onFinish,
  });
}
