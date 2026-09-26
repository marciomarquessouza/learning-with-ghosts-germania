import { create } from "zustand";
import { DialogueKey } from "@/constants/dialogues";
import { Dialogues, InteractionLine } from "@/libs/dialogues/types";

interface DialoguesStore {
  dialogues: Dialogues | null;
  setDialogues: (dialogues: Dialogues) => void;
}

export const useDialoguesStore = create<DialoguesStore>((set) => ({
  dialogues: null,
  setDialogues: (dialogues) => set(() => ({ dialogues })),
}));

export const getDialogueLines = (key: DialogueKey): InteractionLine[] => {
  const dialogues = useDialoguesStore.getState().dialogues;
  if (!dialogues) return [];

  return dialogues[key]?.lines ?? [];
};
