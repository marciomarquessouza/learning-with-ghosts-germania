import { getRequired } from "@/utils/getRequired";
import { AUDIO_SPEED, GameAudio } from "../audio/GameAudio";
import { Lesson, LessonEntry, LessonStepType } from "./types";
import { useLessonStore } from "@/store/lessonStore";
import { GameSnapshot } from "@/store/progressStore";

export class LessonController {
  private _scene?: Phaser.Scene;
  private _gameAudio?: GameAudio;
  private _currentLessonEntry: LessonEntry | null = null;

  public nextEntries: LessonEntry[] = [];
  public completedEntries: LessonEntry[] = [];
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

  public get currentLessonEntry(): LessonEntry {
    return getRequired(
      this._currentLessonEntry,
      "LessonController",
      "_currentLessonEntry",
    );
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

      this._currentLessonEntry = entry;
      this.nextEntries = nextEntries;

      useLessonStore.getState().setCurrentLessonEntryId(entry.id);
    }
  }

  public getCurrentLessonEntry(): LessonEntry {
    return this.currentLessonEntry;
  }

  public callNextEntry(): boolean {
    if (this.hasNextEntry()) {
      useLessonStore
        .getState()
        .addCompletedLessonEntry(this.currentLessonEntry.id);

      const [entry, ...nextEntries] = this.nextEntries;

      this._currentLessonEntry = entry;
      this.nextEntries = nextEntries;

      useLessonStore.getState().setCurrentLessonEntryId(entry.id);

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

    const currentEntryIndex = this.lesson.entries.findIndex(
      ({ id }) => id === snapshot.lessonEntryId,
    );

    if (currentEntryIndex === -1) return;

    this._currentLessonEntry = this.lesson.entries[currentEntryIndex];

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

  private getEntryById(id: string): LessonEntry | undefined {
    const lessonEntry = this.lesson.entries.find((entry) => entry.id === id);
    return lessonEntry;
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
