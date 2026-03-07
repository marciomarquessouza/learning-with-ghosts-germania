import { ChangeSceneEvent, DialogueEvent } from "@/events/game/types";
import { Step, stepBase, StepOptions } from "@/libs/game/runSteps";
import { showDialogue } from "./actions/showDialogue";
import { GameMessage, showGameMessage } from "./actions/showGameMessage";
import { BarsCount, setBarsCount } from "./actions/setBarsCount";
import { IntroductionEvent } from "@/events/scenes/cell/types";
import { events } from "@/events/events";
import { ChallengeEvent, setChallenge } from "./actions/setChallenge";
import { changeWorldTransition } from "./actions/showDreamTransition";
import {
  showDreamIntroduction,
  ShowDreamIntroduction,
} from "./actions/showDreamIntroduction";
import { setGameWorld, SetGameWorld } from "./actions/setGameWorld";

export const stepShowDialogue = (
  payload: DialogueEvent,
  options?: StepOptions,
): Step => {
  return stepBase((context) => {
    const setAlternative = (id?: string) => (context.alternativeId = id);
    return showDialogue(payload, setAlternative);
  }, options);
};

export const stepGameMessage = (
  payload: GameMessage,
  options?: StepOptions,
): Step => stepBase(() => showGameMessage(payload), options);

export const stepBarsCount = (
  payload: BarsCount,
  options?: StepOptions,
): Step => stepBase(() => setBarsCount(payload), options);

export const stepDayIntroduction = (
  payload: IntroductionEvent,
  options?: StepOptions,
): Step =>
  stepBase(
    () => events.scenes.cell.async.emitAsync("show-introduction", payload),
    options,
  );

export const stepSetChallenge = (
  payload: ChallengeEvent,
  options?: StepOptions,
): Step => stepBase(() => setChallenge(payload), options);

export const stepChangeWorldTransition = (
  _payload?: null,
  options?: StepOptions,
): Step => stepBase(() => changeWorldTransition(), options);

export const stepShowDreamIntroduction = (
  payload: ShowDreamIntroduction,
  options?: StepOptions,
): Step => stepBase(() => showDreamIntroduction(payload), options);

export const stepSetGameWorld = (
  payload: SetGameWorld,
  options?: StepOptions,
): Step => stepBase(() => setGameWorld(payload), options);

export const stepChangeScene = (
  payload: ChangeSceneEvent,
  options?: StepOptions,
): Step => {
  return stepBase(
    () => events.game.async.emitAsync("change-scene", payload),
    options,
  );
};
