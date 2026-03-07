import { createEventManagers } from "@/libs/events/createEventManagers";

type Events = {
  "krampus/damage": { amount: number };
  "krampus/speed": { speed: number };
  "krampus/hate": { hate: number };
  "krampus/released": { skyEffectAmount?: number; onFinish: () => void };
};

export const krampusEvents = createEventManagers<Events>();
