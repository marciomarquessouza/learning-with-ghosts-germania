import { DreamScene } from "..";

export function attachGuardian(gameScene: DreamScene) {
  const tutorPositionX = gameScene.gameCamera.camera.width + 200;
  const actorPayload = { startX: tutorPositionX + 1200, startY: 520 };

  gameScene.guardian.create(gameScene, actorPayload);
}
