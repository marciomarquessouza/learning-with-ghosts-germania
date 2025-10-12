import { DayActions } from "../../actionDefaultPerDay/default.actions";
import { runSteps } from "@/events/steps/runSteps";
import {
  stepBarsCount,
  stepDayIntroduction,
  stepGameMessage,
  stepSetChallenge,
  stepSetGameWorld,
  stepShowDreamIntroduction,
  stepShowDreamTransition,
  stepShowDialogue,
  stepShowLessonIntroduction,
  stepShowLesson,
} from "@/events/steps";
import { dialogues } from "./day_01.dialogues";
import { showDialogue } from "@/events/helpers/showDialogue";
import { defaultDialogues } from "../../actionDefaultPerDay/default.dialogues";
import { showGameMessage } from "@/events/helpers/showGameMessage";
import { GAME_WORLDS, Lesson } from "@/types";
import { lesson } from "./day_01.lesson";

class DayActions1 extends DayActions {
  constructor(lesson: Lesson) {
    super(lesson);
  }

  onStart(): void {
    if (this.stage === "introduction") {
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
        {}
      );
    }

    if (this.stage === "learning") {
      runSteps(
        [
          // stepShowDialogue({ lines: dialogues.dream_introduction() }),
          stepGameMessage({
            title: "Go to Eliska",
            text: "Use the arrow keys or the A and D keys",
          }),
        ],
        {}
      );
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
        ],
        {}
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
          stepShowDreamTransition({
            showWhenAlternativeIs: "sleeping_with_ghosts",
          }),
          stepShowDreamIntroduction(
            { lesson: "Greetings" },
            { showWhenAlternativeIs: "sleeping_with_ghosts" }
          ),
          stepSetGameWorld(
            { targetWorld: GAME_WORLDS.DREAM },
            { showWhenAlternativeIs: "sleeping_with_ghosts" }
          ),
        ],
        { alternativeId: undefined }
      );
    } else {
      showDialogue({ lines: defaultDialogues.before_sleep() });
    }
  }

  onConfessionalInteraction() {
    runSteps(
      [
        stepShowDialogue({ lines: dialogues.lesson_preparation() }),
        stepShowDialogue(
          { lines: dialogues.post_introduction_eliska_secret() },
          { showWhenAlternativeIs: "eliska_secret" }
        ),
        stepShowDialogue(
          { lines: dialogues.post_introduction_josef_future() },
          { showWhenAlternativeIs: "josef_future" }
        ),
        stepShowDialogue(
          { lines: dialogues.post_introduction_exit() },
          { showWhenAlternativeIs: "exit" }
        ),
      ],
      { alternativeId: undefined }
    ).then((context) => {
      if (context.alternativeId !== "exit") {
        this.onLessonStart();
      }
    });
  }

  onLessonStart(): void {
    if (!this.lesson) {
      throw new Error("no lesson available");
    }

    runSteps(
      [
        stepShowLessonIntroduction({}),
        stepShowLesson({
          lesson: this.lesson,
        }),
      ],
      {}
    );
  }

  onChallengeClick(): void {
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
}

export const dayAction = new DayActions1(lesson);
