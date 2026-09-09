import { DreamScene } from "..";

export function attachGuardian(gameScene: DreamScene) {
  const position = gameScene.getActorDefaultPositions("guardian");
  const actorPayload = { startX: position.x, startY: position.y };

  gameScene.guardian.create(gameScene, actorPayload);
}
