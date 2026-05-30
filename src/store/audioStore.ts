import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AudioStates {
  isMuted: boolean;
  isUnlocked: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  isRecording: boolean;
  currentVoiceRecordingVolume: number;
}

export interface AudioActions {
  unlock: () => void;
  mute: () => void;
  unmute: () => void;
  setMasterVolume: (v: number) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setVoiceVolume: (v: number) => void;
  setIsRecording: (value: boolean) => void;
  setCurrentVoiceRecordingVolume: (value: number) => void;
}

export type AudioStore = AudioStates & AudioActions;

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      isMuted: false,
      isUnlocked: true,
      masterVolume: 1,
      musicVolume: 0.6,
      sfxVolume: 1,
      voiceVolume: 1,
      isRecording: false,
      currentVoiceRecordingVolume: 0,

      unlock: () => set({ isUnlocked: true }),
      mute: () => set({ isMuted: true }),
      unmute: () => set({ isMuted: false }),

      setMasterVolume: (masterVolume) => set({ masterVolume }),
      setMusicVolume: (musicVolume) => set({ musicVolume }),
      setSfxVolume: (sfxVolume) => set({ sfxVolume }),
      setVoiceVolume: (voiceVolume) => set({ voiceVolume }),
      setIsRecording: (value) => set({ isRecording: value }),
      setCurrentVoiceRecordingVolume: (value: number) =>
        set({ currentVoiceRecordingVolume: value }),
    }),
    {
      name: "audio-settings",
      partialize: (state) => ({
        isMuted: state.isMuted,
        masterVolume: state.masterVolume,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        voiceVolume: state.voiceVolume,
      }),
    },
  ),
);

export const getAudioStates = (): AudioStates => {
  return useAudioStore.getState();
};

export const getAudioActions = (): AudioActions => {
  return useAudioStore.getState();
};
