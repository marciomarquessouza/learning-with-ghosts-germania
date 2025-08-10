import { create } from "zustand";

export interface UiState {
  isInteractionDialogueOpen: boolean;
  setInteractionDialogueOpen: (isOpen: boolean) => void;
  toggleInteractionDialogue: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isInteractionDialogueOpen: false,
  setInteractionDialogueOpen: (isOpen: boolean) =>
    set(() => ({ isInteractionDialogueOpen: isOpen })),
  toggleInteractionDialogue: () =>
    set((state) => ({
      isInteractionDialogueOpen: !state.isInteractionDialogueOpen,
    })),
}));
