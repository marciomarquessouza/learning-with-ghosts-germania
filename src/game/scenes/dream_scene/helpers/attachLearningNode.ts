import { LearningNode } from "@/game/actors/learningNode/LearningNode";
import { DreamScene } from "..";

export function attachLearningNode(gameScene: DreamScene) {
  const lessonId = gameScene.lessonManager.lesson.id;
  const lessonEntry = gameScene.lessonManager.getCurrentLessonEntry();
  const position = gameScene.getActorDefaultPositions("learningNode");
  const learningNode = new LearningNode();
  learningNode.create(gameScene, {
    lessonId,
    lessonEntry,
    startX: position.x,
    startY: position.y,
    flipX: true,
  });
  gameScene.knowledgeTroop.add(learningNode);
  gameScene.learningNode = learningNode;
}
