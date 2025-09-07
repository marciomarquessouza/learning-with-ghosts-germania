import { GAME_WORLDS, gameEvents } from "@/events/gameEvents";
import { DayActions } from "../defaultActions";
import { CHARACTERS } from "@/constants/game";
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
      gameEvents.emit("show-message", {
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
      gameEvents.emit("show-dialogue", {
        lines: [
          {
            type: "dialogue",
            character: CHARACTERS.JOSEF,
            text: ` Converse com a general nas barras.
                    Depois dormimos...`,
          },
        ],
      });
    }
  }

  onChallengeClick(): void {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: `Eu não quero fazer o desafio agora.
                 Prefiro dormir antes de encontrar aquela mulher terrível.`,
        },
      ],
    });
  }

  onDeskClick(): void {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: `Eu não quero fazer nada na mesa agora.
                 Eu só quero domir...`,
        },
      ],
    });
  }

  onFoodClick(): void {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: `Não teremos comida até vencer o desafio de idioma.
                 Esqueça isso. Eu só quero dormir`,
        },
      ],
    });
  }

  onRatClick(): void {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: `Parece que preciso tomar cuidado com a minha comida.
                 Tem um rato aqui`,
        },
      ],
    });
  }
}

export const dayAction = new DayActions1();
