import { gameEvents } from "@/events";
import { DayActions } from "../defaultActions";
import { CHARACTERS } from "@/constants/game";
import { ACTIONS_ICONS } from "@/game/scenes/hud/helpers/actionIcons";

class DayActions1 extends DayActions {
  constructor() {
    super();
  }

  onStart(): void {
    gameEvents.emit("show-introduction", {
      title: "Welcome to the Prison",
      afterClose: () => firstDialogue(),
    });

    const firstDialogue = () => {
      gameEvents.emit("show-dialogue", {
        lines: [
          {
            type: "dialogue",
            text: ` This cell is my new home.
                    I was jailed for not speaking German in Germany.
                    Logic... or absurdity?`,
            character: CHARACTERS.JOSEF,
          },
          {
            type: "dialogue",
            text: ` I don’t want to do anything.
                    I don’t want to think.
                    I just want to sleep.`,
            character: CHARACTERS.JOSEF,
          },
        ],
        onComplete: () => marleneCalling(),
      });

      const marleneCalling = () => {
        gameEvents.emit("show-message", {
          title: "A voice calls you through the bars",
          text: 'Click on "Bars" in the actions menu.',
        });
        gameEvents.emit("hud-actions-badge", {
          icon: ACTIONS_ICONS.BARS,
          count: 1,
        });
      };
    };
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
            text: "In ten minutes your first test begins. The topic: greetings in German.'",
            character: CHARACTERS.MARLENE,
          },
          {
            type: "dialogue",
            text: "Do well, and you eat. Fail, and hunger will be your teacher.",
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
        title: "Mensagem",
        text: "There is no one in the bars at the moment",
      });
    }
  }
}

export const dayAction = new DayActions1();
