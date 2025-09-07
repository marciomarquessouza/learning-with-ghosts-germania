import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { gameEvents } from "../gameEvents";

export interface ChallengeEvent {
  countdown: number;
  onFinish: () => void;
}

export function setChallenge({
  countdown,
  onFinish,
}: ChallengeEvent): Promise<void> {
  return new Promise((resolve) => {
    gameEvents.emit("hud-actions-timer", {
      icon: ACTIONS_ICONS.CHALLENGE,
      timeInSeconds: countdown,
      onFinish,
    });
    return resolve();
  });
}
