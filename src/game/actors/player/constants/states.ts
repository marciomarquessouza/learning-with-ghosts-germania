export const PLAYER_STATES = {
  IDLE: "PLAYER_IDLE",
  MOVING: "PLAYER_MOVING",
  SPEAKING: "PLAYER_SPEAKING",
  LISTENING: "PLAYER_LISTENING",
  SCARED: "PLAYER_SCARED",
} as const;

export type playerStateNames =
  (typeof PLAYER_STATES)[keyof typeof PLAYER_STATES];
