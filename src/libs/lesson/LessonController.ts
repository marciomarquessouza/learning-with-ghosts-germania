import { getRequired } from "@/utils/getRequired";
import { AUDIO_SPEED, GameAudio } from "../audio/GameAudio";
import { Lesson, LessonEntry, LessonStepType } from "./types";
import { useLessonStore } from "@/store/lessonStore";
import { GameSnapshot } from "@/store/progressStore";

export class LessonController {
  private _scene?: Phaser.Scene;
  private _gameAudio?: GameAudio;
  private _currentLessonEntry: LessonEntry | null = null;
  private _lessonCompleted = false;

  public lesson: Lesson;
  public nextEntries: LessonEntry[] = [];
  public completedEntries: LessonEntry[] = [];

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

  public get lessonCompleted(): boolean {
    return this._lessonCompleted;
  }

  private set lessonCompleted(completed: boolean) {
    useLessonStore.getState().setCompleted(completed);
    this._lessonCompleted = completed;
  }

  public get currentLessonEntry(): LessonEntry {
    return getRequired(
      this._currentLessonEntry,
      "LessonController",
      "_currentLessonEntry",
    );
  }

  private set currentLessonEntry(entry: LessonEntry) {
    useLessonStore.getState().setCurrentLessonEntryId(entry.id);
    this._currentLessonEntry = entry;
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

  public getCurrentLessonEntry(): LessonEntry {
    return this.currentLessonEntry;
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

  public setLessonBySnapshot(snapshot?: GameSnapshot | null): void {
    if (!snapshot?.lessonEntryId) return;

    if (
      this.lesson.day !== snapshot.day ||
      this.lesson.id !== snapshot.lessonId
    ) {
      return;
    }

    this.lessonCompleted = snapshot.lessonCompleted ?? false;

    const currentEntryIndex = this.lesson.entries.findIndex(
      ({ id }) => id === snapshot.lessonEntryId,
    );

    if (currentEntryIndex === -1) return;

    this.currentLessonEntry = this.lesson.entries[currentEntryIndex];

    this.completedEntries = this.lesson.entries.slice(0, currentEntryIndex);
    this.nextEntries = this.lesson.entries.slice(currentEntryIndex + 1);
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

  public completeLesson() {
    this.lessonCompleted = true;
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
