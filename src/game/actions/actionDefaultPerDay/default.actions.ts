import { CHARACTERS, GAME_SCENES } from "@/constants/game";
import { gameEvents } from "@/events/gameEvents";
import { showDialogue } from "@/events/helpers/showDialogue";
import {
  stepDayIntroduction,
  stepGameMessage,
  stepShowDialogue,
} from "@/events/steps";
import { runSteps } from "@/events/steps/runSteps";
import { dialogues } from "./default.dialogues";
import { AudioManifest, GameScenes, Lesson } from "@/types";
import { defaultLesson } from "./default.lessons";
import { useLessonStore } from "@/store/lessonStore";
import { useGameStore } from "@/store/gameStore";
import { mergeLessonWithAudioManifest } from "@/utils/mergeLessonWithAudioManifest";
import { lessonActions } from "../lessonActions/LessonActions";

const DEFAULT_SCENE = GAME_SCENES.CELL_SCENE;

export class DayActions {
  private currentGameScene: GameScenes | null = null;
  clicked = {
    desk: 0,
    ratHole: 0,
    bed: 0,
    food: 0,
    solitaire: 0,
    challenge: 0,
    bars: 0,
  };

  get lesson(): Lesson {
    return useLessonStore.getState().lesson;
  }

  set lesson(lesson: Lesson) {
    useLessonStore.getState().update(lesson);
  }

  get gameScene(): GameScenes {
    if (!this.currentGameScene) {
      console.error(
        "The Action Scene was not defined. Returning the default scene: ",
        DEFAULT_SCENE,
      );
      return DEFAULT_SCENE;
    }
    return this.currentGameScene;
  }

  set gameScene(scene: GameScenes) {
    console.log("#Action Scene Defined: ", scene);
    this.currentGameScene = scene;
  }

  constructor(dayLesson: Lesson, audioManifest?: AudioManifest) {
    const lessonWithAudio = mergeLessonWithAudioManifest(
      dayLesson,
      audioManifest,
    );
    if (!this.lesson) {
      this.lesson = lessonWithAudio;
      return;
    }
    const currentDay = useGameStore.getState().day;
    const lessonDay = this.lesson.day;

    if (currentDay > lessonDay) {
      this.lesson = lessonWithAudio;
    }
  }

  create(scene: Phaser.Scene) {
    lessonActions.create(scene, this.lesson);
  }

  update(delta: number) {
    lessonActions.update(delta);
  }

  destroy() {
    lessonActions.destroy();
  }

  onStart() {
    switch (this.currentGameScene) {
      case GAME_SCENES.CELL_SCENE:
      default:
        runSteps(
          [
            stepDayIntroduction({
              title: "More one day...",
            }),
          ],
          {},
        );
    }
  }

  onDeskClick() {
    showDialogue({ lines: dialogues.default_desk_dialogue() });
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

  onDailyChallengeClick() {
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

  onEnterElizaArea() {
    runSteps(
      [
        stepGameMessage({
          title: "Talk with ELiza",
          text: "Press the Space key or the “E” key on your keyboard.",
        }),
      ],
      {},
    );
  }

  onElizaInteraction() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_lesson_preparation() })],
      {
        alternativeId: undefined,
      },
    ).then(() => {
      this.onLesson();
    });
  }

  onLesson() {
    lessonActions.startLesson();
  }

  lessonNextAction() {
    lessonActions.next();
  }
}

export const defaultDayActions = new DayActions(defaultLesson);
