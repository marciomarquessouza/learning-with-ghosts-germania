import { LearningNode } from "@/game/actors/learningNode/LearningNode";
import { DreamScene } from "..";

export function attachLearningNode(gameScene: DreamScene) {
  const lessonId = gameScene.lessonManager.lesson.id;
  const lessonEntry = gameScene.lessonManager.getCurrentLessonEntry();
  const startX = gameScene.tutor.container.x + 200;
  const learningNode = new LearningNode();
  learningNode.create(gameScene, {
    lessonId,
    lessonEntry,
    startX,
    startY: 870,
    flipX: true,
  });
  gameScene.knowledgeTroop.add(learningNode);
  gameScene.learningNode = learningNode;
}
