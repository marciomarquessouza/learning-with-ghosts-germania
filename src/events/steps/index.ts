import { Step } from "@/events/steps/runSteps";
import { showTextDialogue } from "../helpers/showTextDialogue";
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

export const stepTextDialogue =
  (payload: DialogueEvent): Step =>
  async () => {
    await showTextDialogue(payload);
  };

export const stepGameMessage =
  (payload: GameMessage): Step =>
  async () => {
    await showGameMessage(payload);
  };

export const stepBarsCount =
  (payload: BarsCount): Step =>
  async () => {
    await setBarsCount(payload);
  };

export const stepDayIntroduction =
  (payload: DayIntroduction): Step =>
  async () => {
    await showDayIntroduction(payload);
  };

export const stepSetChallenge =
  (payload: ChallengeEvent): Step =>
  async () => {
    await setChallenge(payload);
  };

export const stepShowDreamTransition = (): Step => async () => {
  await showDreamTransition();
};

export const stepShowDreamIntroduction =
  (payload: ShowDreamIntroduction): Step =>
  async () => {
    await showDreamIntroduction(payload);
  };

export const stepSetGameWorld =
  (payload: GameWorld): Step =>
  async () => {
    await setGameWorld(payload);
  };
