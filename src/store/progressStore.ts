import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameScenes, GameWorlds } from "@/types";
import { SceneStateNames as CellSceneStates } from "@/game/scenes/cell_scene/constants/states";
import { SceneFlowNames as CellSceneFlows } from "@/game/scenes/cell_scene/constants/flows";
import { SceneStateNames as DreamSceneStates } from "@/game/scenes/dream_scene/constants/states";
import { SceneFlowNames as DreamSceneFlows } from "@/game/scenes/dream_scene/constants/flows";
import { Vector2 } from "@/utils/vectors";
import { useGameStore } from "./gameStore";
import { useLessonStore } from "./lessonStore";

export type SCENE_STATES = CellSceneStates | DreamSceneStates;
export type SCENE_FLOWS = CellSceneFlows | DreamSceneFlows;

type GameSnapshot = {
  world?: GameWorlds;
  scene?: GameScenes;
  day?: number;
  lessonId?: string;
  state?: SCENE_STATES;
  flow?: SCENE_FLOWS;
  playerPosition?: Vector2;
};

export interface GameProgressStates {
  scene?: GameScenes;
  day?: number;
  snapshot?: GameSnapshot;
}

export interface GameProgressActions {
  createSnapshot: (
    scene: GameScenes,
    day: number,
    snapshot?: GameSnapshot,
  ) => void;
}

export type GameProgressStore = GameProgressStates & GameProgressActions;

export const useGameProgressStore = create<GameProgressStore>()(
  persist(
    (set) => ({
      createSnapshot: (scene, day, snapshot = {}) =>
        set({ scene, day, snapshot }),
    }),
    {
      name: "game-progress",
    },
  ),
);

export function createFlowSnapshot(scene: GameScenes, flow: SCENE_FLOWS) {
  const { currentSceneState, playerSnapshot, gameWorld, day } =
    useGameStore.getState();
  const { lesson } = useLessonStore.getState();
  const snapshot: GameSnapshot = {
    scene,
    day,
    flow,
    world: gameWorld,
    state: currentSceneState,
    lessonId: lesson.id,
    playerPosition: playerSnapshot?.position,
  };
  useGameProgressStore.getState().createSnapshot(scene, day, snapshot);
}

export function getSceneLastSnapshot(
  currentScene: GameScenes,
  currentDay: number,
) {
  const { scene, day, snapshot } = useGameProgressStore.getState();

  if (currentScene !== scene || currentDay !== day) return null;

  return snapshot;
}
