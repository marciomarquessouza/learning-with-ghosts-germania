import { InteractionArea } from "@/libs/game/InteractionArea";
import { Eliza } from "../Eliza";

interface ElizaInteractionCreate {
  eliza: Eliza;
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function createElizaInteractionArea(
  scene: Phaser.Scene,
  { eliza, player, onEnter, onLeave }: ElizaInteractionCreate,
) {
  const interactionArea = new InteractionArea();
  interactionArea.create(scene, {
    player: player,
    target: eliza.sprite,
    width: 500,
    height: 400,
    offsetX: -180,
    onEnter,
    onLeave,
  });

  return interactionArea;
}
