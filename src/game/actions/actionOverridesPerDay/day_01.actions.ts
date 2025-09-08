import { GAME_WORLDS } from "@/events/gameEvents";
import { DayActions } from "../default.actions";
import { runSteps } from "@/events/steps/runSteps";
import {
  stepBarsCount,
  stepDayIntroduction,
  stepGameMessage,
  stepSetChallenge,
  stepSetGameWorld,
  stepShowDreamIntroduction,
  stepShowDreamTransition,
  stepTextDialogue,
} from "@/events/steps";
import { dialogues } from "./day_01.dialogues";
import { showTextDialogue } from "@/events/helpers/showTextDialogue";
import { defaultDialogues } from "../default.dialogues";
import { showGameMessage } from "@/events/helpers/showGameMessage";

class DayActions1 extends DayActions {
  constructor() {
    super();
  }

  onStart(): void {
    runSteps(
      [
        stepDayIntroduction({ title: "Welcome to the Prison" }),
        stepTextDialogue({ lines: dialogues.welcome() }),
        stepBarsCount({ count: 1 }),
        stepGameMessage({
          title: "A voice calls you through the bars",
          text: 'Click on "Bars" in the actions menu.',
        }),
      ],
      {}
    );
  }

  onBarsClick(): void {
    if (this.clicked.bars === 0) {
      this.clicked.bars = 1;
      runSteps(
        [
          stepGameMessage({ hide: true }),
          stepBarsCount({ count: 0 }),
          stepTextDialogue({ lines: dialogues.marlene_first_interaction() }),
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
          stepTextDialogue({
            lines: dialogues.bed_alternatives([
              {
                id: "sleeping_with_ghosts",
                do: () =>
                  runSteps(
                    [
                      stepShowDreamTransition(),
                      stepShowDreamIntroduction({ lesson: "Greetings" }),
                      stepSetGameWorld({ targetWorld: GAME_WORLDS.DREAM }),
                    ],
                    {}
                  ),
              },
              { id: "nothing", do: () => {} },
            ]),
          }),
        ],
        {}
      );
    } else {
      showTextDialogue({ lines: defaultDialogues.before_sleep() });
    }
  }

  onChallengeClick(): void {
    showTextDialogue({ lines: defaultDialogues.default_challenge_dialogue() });
  }

  onDeskClick(): void {
    showTextDialogue({ lines: defaultDialogues.default_desk_dialogue() });
  }

  onFoodClick(): void {
    showTextDialogue({ lines: defaultDialogues.default_food_dialogue() });
  }

  onRatClick(): void {
    showTextDialogue({ lines: defaultDialogues.default_rat_dialogue() });
  }
}

export const dayAction = new DayActions1();
