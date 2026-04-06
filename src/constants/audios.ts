export const AUDIOS = {
  knockOnTheDoor: {
    key: "knockOnTheDoor",
    type: "sfx",
    path: "/audio/sfx/door_knocking.ogg",
  },
};

export type AudioType = "sfx" | "music" | "voice";
export type AudioKeys = keyof typeof AUDIOS;
export type AudioMeta = { key: string; path: string; type: string };
export type AudioFiles = Record<AudioKeys, AudioMeta>;
