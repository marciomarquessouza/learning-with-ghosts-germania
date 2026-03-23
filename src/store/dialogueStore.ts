import { create } from "zustand";
import { Dialogues, InteractionLine } from "@/libs/dialogues/types";
import { DialogueKey } from "@/constants/dialogues";

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
