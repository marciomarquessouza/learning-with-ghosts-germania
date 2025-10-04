import { DEFAULT_INITIAL_WEIGHT } from "@/constants/game";
import { create } from "zustand";
import { persist } from "zustand/middleware";

enum StampTypes {
  REVEAL_NEXT = "REVEAL_NEXT",
  WORD_SIZE = "WORD_SIZE",
  IS_CORRECT = "IS_CORRECT",
  SHOW_ALL = "SHOW_ALL",
}

export type Stamp = {
  id: string;
  name: string;
  position: { x: number; y: number };
  type: StampTypes;
  quantity: number;
};

/**
 * Controls the Josef G cell state
 * */
export type CellState = {
  // states
  weight: number;
  stamps: Stamp[];

  // actions
  setWeight: (amount: number) => void;
  increaseWeight: (amount: number) => void;
  decreaseWeight: (amount: number) => void;
  addStamp: (stamp: Stamp) => void;
  removeStamp: (stampId: string) => void;
  resetStamps: () => void;
};

export const useCellStore = create<CellState>()(
  persist(
    (set) => ({
      weight: DEFAULT_INITIAL_WEIGHT,
      stamps: [],
      setWeight: (amount: number) => set(() => ({ weight: amount })),
      increaseWeight: (amount: number) =>
        set((state) => ({ weight: state.weight + amount })),
      decreaseWeight: (amount: number) =>
        set((state) => ({ weight: Math.max(0, state.weight - amount) })),
      addStamp: (stamp: Stamp) =>
        set((state) => ({ stamps: [...state.stamps, stamp] })),
      removeStamp: (stampId: string) =>
        set((state) => ({
          stamps: state.stamps.filter((stamp) => stamp.id !== stampId),
        })),
      resetStamps: () => set({ stamps: [] }),
    }),
    {
      name: "cell-storage",
    }
  )
);
