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
import { showDreamTransition } from "../helpers/showDreamTransition";
import {
  ShowDreamIntroduction,
  showDreamIntroduction,
} from "../helpers/showDreamIntroduction";
import { GameWorld, setGameWorld } from "../helpers/setGameWorld";
import { showLessonIntroduction } from "../helpers/showLessonIntroduction";
import { LessonEvent, LessonIntroductionProps } from "../lessonEvents";
import { showLesson } from "../helpers/showLesson";

export const stepShowDialogue = (
  payload: DialogueEvent,
  options?: StepOptions
): Step => {
  return stepBase((context) => {
    const setAlternative = (id?: string) => (context.alternativeId = id);
    return showDialogue(payload, setAlternative);
  }, options);
};

export const stepGameMessage = (
  payload: GameMessage,
  options?: StepOptions
): Step => stepBase(() => showGameMessage(payload), options);

export const stepBarsCount = (
  payload: BarsCount,
  options?: StepOptions
): Step => stepBase(() => setBarsCount(payload), options);

export const stepDayIntroduction = (
  payload: DayIntroduction,
  options?: StepOptions
): Step => stepBase(() => showDayIntroduction(payload), options);

export const stepSetChallenge = (
  payload: ChallengeEvent,
  options?: StepOptions
): Step => stepBase(() => setChallenge(payload), options);

export const stepShowDreamTransition = (options?: StepOptions): Step =>
  stepBase(() => showDreamTransition(), options);

export const stepShowDreamIntroduction = (
  payload: ShowDreamIntroduction,
  options?: StepOptions
): Step => stepBase(() => showDreamIntroduction(payload), options);

export const stepSetGameWorld = (
  payload: GameWorld,
  options?: StepOptions
): Step => stepBase(() => setGameWorld(payload), options);

export const stepShowLessonIntroduction = (
  payload: LessonIntroductionProps,
  options?: StepOptions
): Step => stepBase(() => showLessonIntroduction(payload), options);

export const stepShowLesson = (
  payload: LessonEvent,
  options?: StepOptions
): Step => {
  return stepBase(() => showLesson(payload), options);
};
