import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { DreamScene } from "..";
import { useGameStore } from "@/store/gameStore";
import { SceneStateNames } from "../constants/states";

export function createSceneStates(scene: DreamScene) {
  const { setCurrentSceneState } = useGameStore.getState();
  return new StateMachine(scene, {
    source: "scene",
    onStateChange: (state) => setCurrentSceneState(state as SceneStateNames),
  });
}
