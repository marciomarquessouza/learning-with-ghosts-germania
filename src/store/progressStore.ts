import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameScenes, GameWorlds } from "@/types";
import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";
import { SceneStateNames as CellSceneStates } from "@/game/scenes/cell_scene/constants/states";
import { SceneFlowNames as CellSceneFlows } from "@/game/scenes/cell_scene/constants/flows";
import { SceneStateNames as DreamSceneStates } from "@/game/scenes/dream_scene/constants/states";
import { SceneFlowNames as DreamSceneFlows } from "@/game/scenes/dream_scene/constants/flows";
import { Vector2 } from "@/utils/vectors";

export type SCENE_STATES = CellSceneStates | DreamSceneStates;
export type SCENE_FLOWS = CellSceneFlows | DreamSceneFlows;

type GameSnapshot = {
  version: number;
  scene: GameScenes;
  snapshot: {
    world?: GameWorlds;
    scene?: GameScenes;
    state?: SCENE_STATES;
    flow?: SCENE_FLOWS;
    playerPosition?: Vector2;
  };
};

export interface GameProgressStates {
  snapshot: GameSnapshot;
}

export interface GameProgressActions {
  createSnapshot: (snapshot: GameSnapshot) => void;
  setCurrentWorld: (world: GameWorlds) => void;
  setCurrentScene: (scene: GameScenes) => void;
  setCurrentState: (state: string) => void;
  setCurrentFlow: (flow: string) => void;
}

export type GameProgressStore = GameProgressStates & GameProgressActions;

// TODO: Update Game Progress with snapshot mechanic

// export const useGameProgressStore = create<GameProgressStore>()(
//   persist(
//     (set) => ({
//       currentWorld: GAME_WORLDS.REAL,
//       currentScene: GAME_SCENES.CELL_SCENE,
//       currentState: "",
//       currentFlow: "",

//       setCurrentWorld: (world) => set({ currentWorld: world }),
//       setCurrentScene: (scene) => set({ currentScene: scene }),
//       setCurrentState: (state) => set({ currentState: state }),
//       setCurrentFlow: (flow) => set({ currentFlow: flow }),
//     }),
//     {
//       name: "game-progress",
//     },
//   ),
// );
