import { GAME_WORLDS, gameEvents } from "@/events/gameEvents";
import { DayActions } from "../defaultActions";
import { CHARACTERS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";
import { dreamEvents } from "@/events/dreamEvents";
import { cellEvents } from "@/events/cellEvents";
import { runSteps } from "@/events/steps/runSteps";
import {
  stepBarsCount,
  stepDayIntroduction,
  stepGameMessage,
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
        stepDayIntroduction("Welcome to the Prison"),
        stepTextDialogue(dialogues.welcome),
        stepBarsCount(1),
        stepGameMessage(
          "A voice calls you through the bars",
          'Click on "Bars" in the actions menu.'
        ),
      ],
      {}
    );
  }

  onBarsClick(): void {
    if (this.clicked.bars === 0) {
      this.clicked.bars = 1;
      gameEvents.emit("hide-message", {});
      gameEvents.emit("hud-actions-badge", {
        icon: ACTIONS_ICONS.BARS,
        count: 0,
      });
      gameEvents.emit("show-dialogue", {
        lines: [
          {
            type: "dialogue",
            text: "Prisoner Josef G. Already feeling at home in your cell?",
            character: CHARACTERS.MARLENE,
          },
          {
            type: "dialogue",
            text: `In ten minutes your first test begins. The topic: "GREETINGS" in German.`,
            character: CHARACTERS.MARLENE,
          },
          {
            type: "dialogue",
            text: "Do well, and you eat. Fail and you will spend a day hungry to try to improve..",
            character: CHARACTERS.MARLENE,
          },
          {
            type: "dialogue",
            text: "But… I have no books. Nothing to study with.",
            character: CHARACTERS.JOSEF,
          },
          {
            type: "dialogue",
            text: "[MARLENE SMILES] That’s your problem. See you in ten minutes.",
            character: CHARACTERS.MARLENE,
          },
        ],
        onComplete: () => startChallengeTimer(),
      });
      const startChallengeTimer = () => {
        gameEvents.emit("hud-actions-timer", {
          icon: ACTIONS_ICONS.CHALLENGE,
          timeInSeconds: 600,
          onFinish: () => {},
        });
      };
    } else {
      gameEvents.emit("show-message", {
        title: "Message",
        text: "There is no one in the bars at the moment",
      });
    }
  }

  onBedClick(): void {
    if (this.clicked.bars > 0) {
      gameEvents.emit("show-dialogue", {
        lines: [
          {
            type: "alternatives",
            character: CHARACTERS.JOSEF,
            text: "What do you want to do?",
            alternatives: [
              {
                id: "sleeping_with_ghosts",
                text: "Sleep until the challenge arrives",
              },
              {
                id: "nothing",
                text: "Do nothing",
              },
            ],
            onSubmitted: (alternativeId) => {
              if (alternativeId === "sleeping_with_ghosts") {
                cellEvents.emit("dream-transition", {
                  afterClose: () =>
                    dreamEvents.emit("show-introduction", {
                      lesson: "Greetings",
                      afterClose: () =>
                        gameEvents.emit("change-world", {
                          targetWorld: GAME_WORLDS.DREAM,
                        }),
                    }),
                });
              }
            },
          },
        ],
      });
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
