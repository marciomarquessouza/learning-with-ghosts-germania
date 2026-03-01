import { DayActions } from "../../actionDefaultPerDay/default.actions";
import { runSteps } from "@/events/steps/runSteps";
import {
  stepBarsCount,
  stepDayIntroduction,
  stepGameMessage,
  stepSetChallenge,
  stepSetGameWorld,
  stepShowDreamIntroduction,
  stepChangeWorldTransition,
  stepShowDialogue,
  stepShowLesson,
  stepChangeScene,
  stepPlantingPumpkinKid,
} from "@/events/steps";
import { dialogues } from "./day_01.dialogues";
import { showDialogue } from "@/events/helpers/showDialogue";
import { defaultDialogues } from "../../actionDefaultPerDay/default.dialogues";
import { showGameMessage } from "@/events/helpers/showGameMessage";
import { AudioManifest, Lesson } from "@/types";
import { lesson } from "./day_01.lesson";
import audioManifest from "./day_01.audio.json";
import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";

class DayActions1 extends DayActions {
  constructor(lesson: Lesson, audioManifest?: AudioManifest) {
    super(lesson, audioManifest);
  }

  onStart(): void {
    switch (this.scene) {
      case GAME_SCENES.DREAM_SCENE:
        runSteps(
          [
            // stepShowDialogue({ lines: dialogues.dream_introduction() }),
            stepGameMessage({
              title: "Go to Eliska",
              text: "Use the arrow keys or the A and D keys",
            }),
          ],
          {},
        );
        break;
      case GAME_SCENES.CELL_SCENE:
        runSteps(
          [
            stepDayIntroduction({ title: "Welcome to the Prison" }),
            stepShowDialogue({ lines: dialogues.welcome() }),
            stepBarsCount({ count: 1 }),
            stepGameMessage({
              title: "A voice calls you through the bars",
              text: 'Click on "Bars" in the actions menu.',
            }),
          ],
          {},
        );
        break;
    }
  }

  onBarsClick(): void {
    if (this.clicked.bars === 0) {
      this.clicked.bars = 1;
      runSteps(
        [
          stepGameMessage({ hide: true }),
          stepBarsCount({ count: 0 }),
          stepShowDialogue({ lines: dialogues.marlene_first_interaction() }),
          stepSetChallenge({ countdown: 600, onFinish: () => {} }),
          stepGameMessage({
            title: "Dreaming with Ghosts",
            text: 'Click on the "Bed" to sleep… and see what waits for you.',
          }),
        ],
        {},
      );
    } else {
      showGameMessage({
        title: "Message",
        text: "There is no one in the bars at the moment",
      });
    }
  }

  onBedClick(): void {
    if (this.clicked.bars > 0) {
      runSteps(
        [
          stepShowDialogue({
            lines: dialogues.bed_alternatives(),
          }),
          stepChangeWorldTransition(null, {
            showWhenAlternativeIs: "sleeping_with_ghosts",
          }),
          stepShowDreamIntroduction(
            { lesson: lesson.title },
            { showWhenAlternativeIs: "sleeping_with_ghosts" },
          ),
          stepSetGameWorld(
            { targetWorld: GAME_WORLDS.DREAM, targetScene: "GhostDreamScene" },
            { showWhenAlternativeIs: "sleeping_with_ghosts" },
          ),
        ],
        { alternativeId: undefined },
      );
    } else {
      showDialogue({ lines: defaultDialogues.before_sleep() });
    }
  }

  onDailyChallengeClick(): void {
    showDialogue({ lines: defaultDialogues.default_challenge_dialogue() });
  }

  onDeskClick(): void {
    showDialogue({ lines: defaultDialogues.default_desk_dialogue() });
  }

  onFoodClick(): void {
    showDialogue({ lines: defaultDialogues.default_food_dialogue() });
  }

  onRatClick(): void {
    showDialogue({ lines: defaultDialogues.default_rat_dialogue() });
  }

  onConfessionalInteraction() {
    if (!this.lesson) {
      throw new Error("no lesson available");
    }

    runSteps(
      [
        // stepShowDialogue({ lines: dialogues.lesson_preparation() }),
        stepPlantingPumpkinKid(),
        // stepShowLesson({ lesson: this.lesson }),
        // stepShowDialogue({ lines: dialogues.lesson_finish() }),
        // stepShowDialogue(
        //   { lines: dialogues.challenge_accepted() },
        //   { showWhenAlternativeIs: "train_challenge" },
        // ),
        // stepChangeScene(
        //   { targetScene: "TrainScene", fade: true },
        //   { showWhenAlternativeIs: "train_challenge" },
        // ),
        // stepShowDialogue(
        //   { lines: dialogues.return_to_cell() },
        //   { showWhenAlternativeIs: "return" },
        // ),
        // stepChangeWorldTransition(null, { showWhenAlternativeIs: "return" }),
        // stepSetGameWorld(
        //   {
        //     targetWorld: GAME_WORLDS.REAL,
        //     targetScene: "CellScene",
        //   },
        //   { showWhenAlternativeIs: "return" },
        // ),
      ],
      { alternativeId: undefined },
    );
  }
}

export const dayAction = new DayActions1(lesson, audioManifest);
