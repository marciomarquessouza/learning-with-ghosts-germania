export const JOSEF_STATES = {
  IDLE: "JOSEF_IDLE",
  WALKING: "JOSEF:WALKING",
  SPEAKING: "JOSEF_IDLE",
  LISTENING: "JOSEF_LISTENING",
} as const;

export type JosefStateNames = (typeof JOSEF_STATES)[keyof typeof JOSEF_STATES];
