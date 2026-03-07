import { createEventManagers } from "@/libs/events/createEventManagers";
import { ChallengeCommand } from "@/types";

type Events = {
  "train/controls:show": undefined;
  "train/speed": { speed: number };
  "train/coal:add": { amount: number };
  "train/pressure": { pressure: number };
  "train/attack:availability": { enabled: boolean; gap?: number };
  "train/attack:arrow": { power: number };
  "train/challenge": { command: ChallengeCommand };
};

export const trainEvents = createEventManagers<Events>();
