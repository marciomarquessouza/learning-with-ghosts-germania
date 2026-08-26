import { Player } from "../player/Player";
import { LearningNode } from "../learningNode/LearningNode";
import { getRequired } from "@/utils/getRequired";
import { Vector2 } from "@/utils/vectors";
import { LessonEntryWithScore } from "@/libs/lesson/LessonController";
import { Lesson } from "@/libs/lesson/types";

export class KnowledgeTroop {
  public static DEFAULT_POSITION_Y = 778;
  public static DEFAULT_GAP = 120;
  public static DEFAULT_PLAYER_DISTANCE = 180;

  private _scene?: Phaser.Scene;
  private _player?: Player;
  private _lesson?: Lesson;
  private readonly members = new Map<string, LearningNode>();

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "KnowledgeTroop", "_scene");
  }

  private get player(): Player {
    return getRequired(this._player, "KnowledgeTroop", "_player");
  }

  private get lesson(): Lesson {
    return getRequired(this._lesson, "KnowledgeTroop", "_lesson");
  }

  public create(scene: Phaser.Scene, player: Player, lesson: Lesson) {
    this._scene = scene;
    this._player = player;
    this._lesson = lesson;
  }

  public getFirstWorldPosition(): Vector2 {
    return {
      y: KnowledgeTroop.DEFAULT_POSITION_Y,
      x:
        this.player.getWorldPosition().x -
        KnowledgeTroop.DEFAULT_PLAYER_DISTANCE,
    };
  }

  public async addByEntries(completedEntries: LessonEntryWithScore[]) {
    if (completedEntries.length === 0) return;

    for (const lessonEntry of completedEntries) {
      const learningNode = new LearningNode();
      const firstWorldPosition = this.getFirstWorldPosition();

      learningNode.create(this.scene, {
        lessonId: this.lesson.id,
        lessonEntry,
        flipX: true,
        startY: firstWorldPosition.y,
        startX: firstWorldPosition.x,
      });

      const targetWorldX =
        firstWorldPosition.x -
        KnowledgeTroop.DEFAULT_GAP * lessonEntry.sequence;

      this.add(learningNode);

      learningNode.setBehaviorByCurrentScore();
      await learningNode.walkToWorldX(targetWorldX);
      learningNode.enterFullIdleState();
    }
  }

  public add(learningNode: LearningNode): boolean {
    if (this.members.has(learningNode.slug)) {
      console.error("LearningNode already included");
      return false;
    }
    this.members.set(learningNode.slug, learningNode);
    return true;
  }

  public remove(learningNode: LearningNode): boolean {
    return this.members.delete(learningNode.slug);
  }

  public followPlayer() {
    throw new Error("Method not implemented");
  }

  public unfollowPlayer() {
    throw new Error("Method not implemented");
  }

  public moveToMemoryGuardian() {
    throw new Error("Method not implemented");
  }

  public update(delta: number) {
    this.members.forEach((learningNode) => learningNode.update(delta));
  }

  public destroy() {
    this.members.forEach((learningNode) => learningNode.destroy());
    this.members.clear();
    this._player = undefined;
    this._scene = undefined;
  }
}
