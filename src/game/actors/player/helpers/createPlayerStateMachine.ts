import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { IdleState } from "../states/IdleState";
import { MovingState } from "../states/MovingState";
import { ListeningState } from "../states/ListeningState";
import { SpeakingState } from "../states/SpeakingState";
import { Player } from "../Player";
import { ScaredState } from "../states/ScaredState";
import { PlayerStateNames } from "../constants/states";
import { InclinedState } from "../states/InclinedState";
import { useGameStore } from "@/store/gameStore";

export function createPlayerStateMachine(
  scene: Phaser.Scene,
  player: Player,
): StateMachine {
  const { setPlayerSnapshot } = useGameStore.getState();
  const stateMachine = new StateMachine(scene, {
    onStateChange: (state) =>
      setPlayerSnapshot({
        position: { x: player.sprite.x, y: player.sprite.y },
        state: state as PlayerStateNames,
      }),
  });

  const states: [PlayerStateNames, StateConstructor<IState>][] = [
    [Player.STATES.IDLE, IdleState],
    [Player.STATES.MOVING, MovingState],
    [Player.STATES.LISTENING, ListeningState],
    [Player.STATES.SPEAKING, SpeakingState],
    [Player.STATES.SCARED, ScaredState],
    [Player.STATES.INCLINED, InclinedState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, player);
  });

  return stateMachine;
}
