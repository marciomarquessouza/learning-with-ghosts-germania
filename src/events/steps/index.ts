import { Step, stepBase, StepOptions } from "@/events/steps/runSteps";
import { showDialogue } from "../helpers/showDialogue";
import { GameMessage, showGameMessage } from "../helpers/showGameMessage";
import { BarsCount, setBarsCount } from "../helpers/setBarsCount";
import {
  DayIntroduction,
  showDayIntroduction,
} from "../helpers/showDayIntroduction";
import { ChallengeEvent, setChallenge } from "../helpers/setChallenge";
import { DialogueEvent } from "../gameEvents";
import { changeWorldTransition } from "../helpers/showDreamTransition";
import {
  ShowDreamIntroduction,
  showDreamIntroduction,
} from "../helpers/showDreamIntroduction";
import { SetGameWorld, setGameWorld } from "../helpers/setGameWorld";
import { LessonEvent } from "../lessonEvents";
import { showLesson } from "../helpers/showLesson";
import { changeScene, ChangeScene } from "../helpers/changeScene";
import { plantingPumpkinKid } from "../helpers/plantingPumpkinKid";

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
  payload: DayIntroduction,
  options?: StepOptions,
): Step => stepBase(() => showDayIntroduction(payload), options);

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

export const stepShowLesson = (
  payload: LessonEvent,
  options?: StepOptions,
): Step => {
  return stepBase(() => showLesson(payload), options);
};

export const stepChangeScene = (
  payload: ChangeScene,
  options?: StepOptions,
): Step => {
  return stepBase(() => changeScene(payload), options);
};

export const stepPlantingPumpkinKid = (
  _payload?: null,
  options?: StepOptions,
): Step => {
  return stepBase(() => plantingPumpkinKid(), options);
};
