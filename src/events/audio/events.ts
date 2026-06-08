// src/events/audio/events.ts
import { createEventManagers } from "@/libs/events/createEventManagers";
import type {
  AudioMusicPlayEvent,
  AudioMusicSetVolumeEvent,
  AudioMusicStopEvent,
  AudioPlaySample,
  AudioSfxPlayEvent,
  AudioSfxSetVolumeEvent,
  AudioVoicePlayEvent,
} from "./types";

export type AudioSyncEvents = {
  "audio:unlock": undefined;
  "audio:sfx:play": AudioSfxPlayEvent;
  "audio:music:play": AudioMusicPlayEvent;
  "audio:music:stop": AudioMusicStopEvent;
  "audio:music:set-volume": AudioMusicSetVolumeEvent;
  "audio:sfx:set-volume": AudioSfxSetVolumeEvent;
  "audio:mute": undefined;
  "audio:unmute": undefined;
  "audio:play-sample": AudioPlaySample;
};

export type AudioAsyncEvents = {
  "audio:voice:play": AudioVoicePlayEvent;
};

export const audioEvents = createEventManagers<
  AudioSyncEvents,
  AudioAsyncEvents
>();

export type AudioEvents = typeof audioEvents;
