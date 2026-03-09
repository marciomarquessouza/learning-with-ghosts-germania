import { DayActions } from "../../actionDefaultPerDay/default.actions";
import { runSteps } from "@/libs/game/runSteps";
import { dialogues } from "./day_01.dialogues";
import { dialogues as defaultDialogues } from "../../actionDefaultPerDay/default.dialogues";
import { AudioManifest, Lesson } from "@/types";
import { lesson } from "./day_01.lesson";
import audioManifest from "./day_01.audio.json";
import { GAME_SCENES, GAME_WORLDS } from "@/constants/game";
import {
  stepBarsCount,
  stepChangeWorldTransition,
  stepDayIntroduction,
  stepGameMessage,
  stepSetChallenge,
  stepSetGameWorld,
  stepShowDialogue,
  stepShowDreamIntroduction,
} from "@/game/actions/stepActions";

class DayActions1 extends DayActions {
  constructor(lesson: Lesson, audioManifest?: AudioManifest) {
    super(lesson, audioManifest);
  }

  onStart(): void {
    switch (this.gameScene) {
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
      runSteps(
        [
          stepGameMessage({
            title: "Message",
            text: "There is no one in the bars at the moment",
          }),
        ],
        {},
      );
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
            { targetWorld: GAME_WORLDS.DREAM, targetScene: GAME_SCENES.DREAM_SCENE },
            { showWhenAlternativeIs: "sleeping_with_ghosts" },
          ),
        ],
        { alternativeId: undefined },
      );
    } else {
      runSteps(
        [stepShowDialogue({ lines: defaultDialogues.before_sleep() })],
        {},
      );
    }
  }

  onDailyChallengeClick(): void {
    runSteps(
      [
        stepShowDialogue({
          lines: defaultDialogues.default_challenge_dialogue(),
        }),
      ],
      {},
    );
  }

  onDeskClick(): void {
    runSteps(
      [
        stepShowDialogue({
          lines: defaultDialogues.default_desk_dialogue(),
        }),
      ],
      {},
    );
  }

  onFoodClick(): void {
    runSteps(
      [
        stepShowDialogue({
          lines: defaultDialogues.default_food_dialogue(),
        }),
      ],
      {},
    );
  }

  // onElizaInteraction() {
  //   runSteps([stepShowDialogue({ lines: dialogues.lesson_preparation() })], {
  //     alternativeId: undefined,
  //   });
  // }
}

export const dayAction = new DayActions1(lesson, audioManifest);
