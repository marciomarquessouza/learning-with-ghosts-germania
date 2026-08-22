import { Player } from "../player/Player";
import { LearningNode } from "../learningNode/LearningNode";
import { LessonEntry } from "@/libs/lesson/types";
import { getRequired } from "@/utils/getRequired";
import { Vector2 } from "@/utils/vectors";

export class KnowledgeTroop {
  public static DEFAULT_POSITION_Y = 778;
  public static DEFAULT_GAP = 120;
  public static DEFAULT_PLAYER_DISTANCE = 180;

  private _scene?: Phaser.Scene;
  private _player?: Player;
  private readonly members = new Map<string, LearningNode>();

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "KnowledgeTroop", "this._scene");
  }

  private get player(): Player {
    return getRequired(this._player, "KnowledgeTroop", "this._player");
  }

  public create(scene: Phaser.Scene, player: Player) {
    this._scene = scene;
    this._player = player;
  }

  public getFirstWorldPosition(): Vector2 {
    return {
      y: KnowledgeTroop.DEFAULT_POSITION_Y,
      x:
        this.player.getWorldPosition().x -
        KnowledgeTroop.DEFAULT_PLAYER_DISTANCE,
    };
  }

  public async addByEntries(completedEntries: LessonEntry[]) {
    if (completedEntries.length === 0) return;

    for (const lessonEntry of completedEntries) {
      const learningNode = new LearningNode();
      const firstWorldPosition = this.getFirstWorldPosition();

      learningNode.create(this.scene, {
        lessonEntry,
        flipX: true,
        startY: firstWorldPosition.y,
        startX: firstWorldPosition.x,
      });

      const targetWorldX =
        firstWorldPosition.x -
        KnowledgeTroop.DEFAULT_GAP * lessonEntry.sequence;

      this.add(learningNode);

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
