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
  public static MIN_DISTANCE_TO_FOLLOW_PLAYER = 20;

  private _scene?: Phaser.Scene;
  private _player?: Player;
  private _lesson?: Lesson;

  private readonly members = new Map<string, LearningNode>();
  private isFollowingTarget = false;

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

      learningNode.sprite.setOrigin(0.5, 1);
      learningNode.sprite.setPosition(firstWorldPosition.x, 883);

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

  public startToFollowTarget() {
    this.isFollowingTarget = true;
  }

  private followTarget(learningNode: LearningNode) {
    // console.log({
    //   target: learningNode.target,
    //   originX: learningNode.sprite.originX,
    //   originY: learningNode.sprite.originY,
    //   displayOriginY: learningNode.sprite.displayOriginY,
    //   displayOriginX: learningNode.sprite.displayOriginX,
    //   y: learningNode.sprite.y,
    //   globalY: learningNode.getWorldPosition().y,
    // });
    if (!this.isFollowingTarget) return;
    const lnGlobalPositionX = learningNode.getWorldPosition().x;
    const targetGlobalPositionX = this.player.getWorldPosition().x;

    const direction = targetGlobalPositionX > lnGlobalPositionX ? 1 : -1;
    const distance = Math.abs(targetGlobalPositionX - lnGlobalPositionX);
    const minDistance =
      KnowledgeTroop.DEFAULT_PLAYER_DISTANCE +
      KnowledgeTroop.DEFAULT_GAP * learningNode.lessonEntry.sequence +
      KnowledgeTroop.MIN_DISTANCE_TO_FOLLOW_PLAYER;

    if (distance > minDistance) {
      learningNode.stateMachine.changeTo(LearningNode.STATES.FULL_WALKING);

      if (direction > 0) {
        learningNode.sprite.setVelocityX(+this.player.speed);
        learningNode.sprite.setFlipX(false);
      }

      if (direction < 0) {
        learningNode.sprite.setVelocityX(-this.player.speed);
        learningNode.sprite.setFlipX(true);
      }
    } else {
      learningNode.stateMachine.changeTo(LearningNode.STATES.FULL_IDLE);
      learningNode.sprite.setVelocityX(0);
    }
  }

  private regroupTroop() {
    throw new Error("Method not implemented");
  }

  public stopToFollowPlayer() {
    this.isFollowingTarget = false;
  }

  public moveToMemoryGuardian() {
    throw new Error("Method not implemented");
  }

  public update(delta: number) {
    this.members.forEach((learningNode) => {
      this.followTarget(learningNode);
      learningNode.update(delta);
    });
  }

  public destroy() {
    this.members.forEach((learningNode) => learningNode.destroy());
    this.members.clear();
    this._player = undefined;
    this._scene = undefined;
  }
}
