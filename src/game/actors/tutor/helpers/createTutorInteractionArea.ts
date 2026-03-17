import { InteractionArea } from "@/libs/game/InteractionArea";
import { Tutor } from "../Tutor";

interface TutorInteractionCreate {
  tutor: Tutor;
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function createTutorInteractionArea(
  scene: Phaser.Scene,
  { tutor, player, onEnter, onLeave }: TutorInteractionCreate,
) {
  const interactionArea = new InteractionArea();
  interactionArea.create(scene, {
    player: player,
    target: tutor.sprite,
    width: 500,
    height: 400,
    offsetX: -180,
    onEnter,
    onLeave,
  });

  return interactionArea;
}
