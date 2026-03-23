import { create } from "zustand";
import { Dialogues } from "@/libs/dialogues/types";

interface DialoguesStore {
  dialogues: Dialogues;
  setDialogues: (dialogues: Dialogues) => void;
}

export const useDialoguesStore = create<DialoguesStore>((set) => ({
  dialogues: {} as Dialogues,
  setDialogues: (dialogues) => set({ dialogues }),
}));
