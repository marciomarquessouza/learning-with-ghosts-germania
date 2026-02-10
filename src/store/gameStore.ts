import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";
import { GameScenes, GameWorlds } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the overall state of the game (multiple scenes)
 */
export interface GameState {
  day: number;
  debugMode: boolean;
  gameWorld: GameWorlds;
  currentScene: GameScenes;
  setDay: (day: number) => void;
  increaseDay: () => void;
  setGameScene: (gameWorld: GameWorlds, scene: GameScenes) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      day: 0,
      debugMode: false,
      gameWorld: GAME_WORLDS.REAL,
      setDay: (day: number) => set((state) => ({ ...state, day })),
      increaseDay: () => set((state) => ({ ...state, day: state.day + 1 })),
      currentScene: GAME_SCENES.CELL_SCENE,
      setGameScene: (gameWorld: GameWorlds, currentScene: GameScenes) =>
        set((state) => ({ ...state, gameWorld, currentScene })),
    }),
    { name: "game-storage" },
  ),
);
