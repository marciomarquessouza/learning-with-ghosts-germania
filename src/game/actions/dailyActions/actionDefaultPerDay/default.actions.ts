import { GAME_SCENES } from "@/constants/game";
import { runSteps } from "@/libs/game/runSteps";
import { dialogues } from "./default.dialogues";
import { AudioManifest, GameScenes, Lesson } from "@/types";
import { defaultLesson } from "./default.lessons";
import { useLessonStore } from "@/store/lessonStore";
import { useGameStore } from "@/store/gameStore";
import { mergeLessonWithAudioManifest } from "@/utils/mergeLessonWithAudioManifest";
import {
  stepDayIntroduction,
  stepGameMessage,
  stepShowDialogue,
} from "../../stepActions";
import { events } from "@/events/events";

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

  protected set lesson(lesson: Lesson) {
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
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_desk_dialogue() })],
      {},
    );
    this.clicked.desk += 1;
  }

  onBedClick() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_bed_dialogue() })],
      {},
    );
    this.clicked.desk += 1;
  }

  onFoodClick() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_food_dialogue() })],
      {},
    );
    this.clicked.food += 1;
  }

  onRatClick() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_rat_dialogue() })],
      {},
    );
    this.clicked.ratHole += 1;
  }

  onBarsClick() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_marlene_first_dialogue() })],
      {},
    );
  }

  onDailyChallengeClick() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.daily_challenge_alternatives() })],
      { alternativeId: undefined },
    );
  }

  onEnterTutorArea() {
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

  onTutorInteraction() {
    runSteps(
      [stepShowDialogue({ lines: dialogues.default_lesson_preparation() })],
      {
        alternativeId: undefined,
      },
    ).then(() => {
      events.lesson.sync.emit("start-lesson");
    });
  }
}

export const defaultDayActions = new DayActions(defaultLesson);
