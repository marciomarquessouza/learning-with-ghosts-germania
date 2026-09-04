import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { DREAM_SCENE_STATES as SCENE_STATES } from "../constants/states";
import { IdleState } from "../states/IdleState";
import { DreamScene } from "..";
import { IntroState } from "../states/IntroState";
import { PerformingActionState } from "../states/PerformingActionState";
import { PerformingLessonState } from "../states/PerformingLessonState";
import { PostLessonState } from "../states/PostLessonState";

export function attachSceneStates(
  stateMachine: StateMachine,
  scene: DreamScene,
) {
  stateMachine
    .addState(SCENE_STATES.IDLE, IdleState, scene)
    .addState(SCENE_STATES.INTRO, IntroState, scene)
    .addState(SCENE_STATES.PERFORMING_ACTION, PerformingActionState, scene)
    .addState(SCENE_STATES.PERFORMING_LESSON, PerformingLessonState, scene)
    .addState(SCENE_STATES.POST_LESSON, PostLessonState, scene);
}
