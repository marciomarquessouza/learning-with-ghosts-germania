import { Player } from "../player/Player";
import { LearningNode } from "../learningNode/LearningNode";

export class KnowledgeTroop {
  private readonly members = new Map<string, LearningNode>();
  private player: Player | null = null;

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

  public followPlayer(player: Player) {
    this.player = player;
    throw new Error("Method not implemented");
  }

  public unfollowPlayer() {
    this.player = null;
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
    this.player = null;
  }
}
