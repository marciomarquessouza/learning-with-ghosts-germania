import { CHARACTERS, MOODS } from "@/constants/game";
import { gameEvents } from "@/events/gameEvents";
import { showDialogue } from "@/events/helpers/showDialogue";
import { stepDayIntroduction } from "@/events/steps";
import { runSteps } from "@/events/steps/runSteps";
import { defaultDialogues } from "./default.dialogues";
import { AudioManifest, Lesson } from "@/types";
import { defaultLesson } from "./default.lessons";
import { useLessonStore } from "@/store/lessonStore";
import { useGameStore } from "@/store/gameStore";
import { mergeLessonWithAudioManifest } from "@/utils/mergeLessonWithAudioManifest";

export type Stage = "introduction" | "lesson" | "learning" | "challenge";

export class DayActions {
  public stage: Stage = "introduction";
  clicked = {
    desk: 0,
    ratHole: 0,
    bed: 0,
    food: 0,
    solitaire: 0,
    challenge: 0,
    bars: 0,
  };

  get lesson(): Lesson | null {
    return useLessonStore.getState().lesson;
  }

  set lesson(lesson: Lesson) {
    useLessonStore.getState().update(lesson);
  }

  constructor(dayLesson: Lesson, audioManifest?: AudioManifest) {
    const lessonWithAudio = mergeLessonWithAudioManifest(
      dayLesson,
      audioManifest
    );
    this.createDayLesson(lessonWithAudio);
  }

  private createDayLesson(dayLesson: Lesson) {
    if (!this.lesson) {
      this.lesson = dayLesson;
      return;
    }
    const currentDay = useGameStore.getState().day;
    const lessonDay = this.lesson.day;

    if (currentDay > lessonDay) {
      this.lesson = dayLesson;
    }
  }

  setStage(stage: Stage) {
    this.stage = stage;
  }

  onStart() {
    switch (this.stage) {
      case "introduction":
      default:
        runSteps(
          [
            stepDayIntroduction({
              title: "More one day...",
            }),
          ],
          {}
        );
    }
  }

  onDeskClick() {
    showDialogue({ lines: defaultDialogues.default_desk_dialogue() });
    this.clicked.desk += 1;
  }

  onBedClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "I don't want to do anything in bed right now",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onConfessionalInteraction() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.ELISA,
          text: "Olá Josef",
          moods: [
            { mood: MOODS.HAPPY, character: CHARACTERS.ELISA },
            { mood: MOODS.SURPRISED, character: CHARACTERS.JOSEF },
          ],
        },
      ],
    });
  }

  onLessonStart() {}

  onFoodClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "Food",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onRatClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.JOSEF,
          text: "Food",
        },
      ],
    });

    this.clicked.desk += 1;
  }

  onBarsClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "dialogue",
          character: CHARACTERS.MARLENE,
          text: "I Hate You!",
        },
      ],
    });
  }

  onChallengeClick() {
    gameEvents.emit("show-dialogue", {
      lines: [
        {
          type: "alternatives",
          character: CHARACTERS.MARLENE,
          text: "Você realmente quer iniciar o desafio do dia agora?",
          alternatives: [
            {
              id: "skip",
              text: "NÃO - eu quero me preparar mais",
            },
            {
              id: "challenge",
              text: "SIM - eu quero fayer o desafio agora!",
            },
          ],
          onSubmitted: (id) => {
            console.log("#CHALLENGE AINDA NÃO IMPLEMENTADO", id);
          },
        },
      ],
    });
  }
}

export const defaultDayActions = new DayActions(defaultLesson);
