import { FlowController } from "@/libs/game/game-flow/FlowController";
import { DreamScene } from "..";
import { PauseFlow } from "../flows/Pause.flow";
import { SceneFlowNames } from "../constants/flows";
import { useGameStore } from "@/store/gameStore";
import { createFlowSnapshot } from "@/store/progressStore";
import { GAME_SCENES } from "@/constants/game";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";

export function createSceneFlowController(
  scene: DreamScene,
  stateMachine: StateMachine,
) {
  const { setCurrentFlow } = useGameStore.getState();
  return new FlowController({
    scene: scene,
    gameScene: scene,
    cancelFlow: PauseFlow,
    onRunNewFlow: (flowName) => {
      const newFlow = flowName as SceneFlowNames;
      setCurrentFlow(newFlow);
      createFlowSnapshot(GAME_SCENES.DREAM_SCENE, newFlow);
    },
    onRunScheduledFlow: (state) =>
      stateMachine.changeTo(state || DreamScene.STATES.IDLE),
  });
}
