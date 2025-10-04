import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the overall state of the game (multiple scenes)
 */
export interface GameState {
  day: number;
  debugMode: boolean;
  setDay: (day: number) => void;
  increaseDay: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      day: 1,
      debugMode: false,
      setDay: (day: number) => set((state) => ({ ...state, day })),
      increaseDay: () => set((state) => ({ ...state, day: state.day + 1 })),
    }),
    { name: "game-storage" }
  )
);
