export const JOSEF_STATES = {
  IDLE: "JOSEF_IDLE",
  MOVING: "JOSEF_MOVING",
  SPEAKING: "JOSEF_SPEAKING",
  LISTENING: "JOSEF_LISTENING",
} as const;

export type JosefStateNames = (typeof JOSEF_STATES)[keyof typeof JOSEF_STATES];
