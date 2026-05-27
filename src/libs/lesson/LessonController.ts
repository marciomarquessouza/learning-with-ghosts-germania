import { getRequired } from "@/utils/getRequired";
import { AUDIO_SPEED, GameAudio } from "../audio/game-audio/GameAudio";
import { Lesson, LessonEntry, LessonStepType } from "./types";

export class LessonController {
  private _scene?: Phaser.Scene;
  private _gameAudio?: GameAudio;
  private nextEntries: LessonEntry[] = [];
  public currentLessonEntry: LessonEntry | null = null;
  public lesson: Lesson;

  constructor(lesson: Lesson) {
    this.lesson = lesson;
    this.nextEntries = [...this.lesson.entries];
    this.setCurrentLessonEntry();
  }

  private get gameAudio(): GameAudio {
    return getRequired(this._gameAudio, "LessonController", "_gameAudio");
  }

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "LessonController", "this._scene");
  }

  preload(scene: Phaser.Scene, gameAudio: GameAudio) {
    this.getLessonAudios().forEach(({ key, file }) => {
      if (file) gameAudio.preload(scene, key, file);
    });
  }

  create(scene: Phaser.Scene, gameAudio: GameAudio) {
    this._scene = scene;
    this._gameAudio = gameAudio;
  }

  private setCurrentLessonEntry() {
    if (this.hasNextEntry()) {
      const [entry, ...nextEntries] = this.nextEntries;
      this.currentLessonEntry = entry;
      this.nextEntries = nextEntries;
    }
  }

  public callNextEntry(): boolean {
    if (this.hasNextEntry()) {
      const [entry, ...nextEntries] = this.nextEntries;
      this.currentLessonEntry = entry;
      this.nextEntries = nextEntries;
      return true;
    }

    return false;
  }

  public getStepByType(stepType: LessonStepType) {
    const step = this.currentLessonEntry?.steps.find(
      ({ type }) => stepType === type,
    );

    if (!step) {
      throw new Error(
        `Step not found: Lesson ${this.lesson.title} | Entry: ${this.currentLessonEntry?.id}`,
      );
    }

    return step;
  }

  public hasNextEntry() {
    return this.nextEntries.length > 0;
  }

  public getCurrentLessonDay() {
    return this.lesson.day;
  }

  public getEntryTarget() {
    if (!this.currentLessonEntry?.target) {
      throw new Error("Lesson Controller: target not available");
    }
    return this.currentLessonEntry.target;
  }

  private getLessonAudios() {
    return this.lesson.entries.map(({ id, audio }) => ({
      key: id,
      file: audio,
    }));
  }

  public async playTargetAudio(
    speed: number = AUDIO_SPEED.NORMAL,
  ): Promise<void> {
    const entryId = this.currentLessonEntry?.id;
    if (!entryId) {
      throw new Error("playTargetAudio: Lesson entry id not available");
    }

    await this.gameAudio.playVoice(entryId, { rate: speed });
  }
}
