import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameScenes, GameWorlds } from "@/types";
import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";

export interface GameProgressStates {
  currentWorld: GameWorlds;
  currentScene: GameScenes;
  currentState: string;
  currentFlow: string;
}

export interface GameProgressActions {
  setCurrentWorld: (world: GameWorlds) => void;
  setCurrentScene: (scene: GameScenes) => void;
  setCurrentState: (state: string) => void;
  setCurrentFlow: (flow: string) => void;
}

export type GameProgressStore = GameProgressStates & GameProgressActions;

export const useGameProgressStore = create<GameProgressStore>()(
  persist(
    (set) => ({
      currentWorld: GAME_WORLDS.REAL,
      currentScene: GAME_SCENES.CELL_SCENE,
      currentState: "",
      currentFlow: "",

      setCurrentWorld: (world) => set({ currentWorld: world }),
      setCurrentScene: (scene) => set({ currentScene: scene }),
      setCurrentState: (state) => set({ currentState: state }),
      setCurrentFlow: (flow) => set({ currentFlow: flow }),
    }),
    {
      name: "game-progress",
    },
  ),
);
