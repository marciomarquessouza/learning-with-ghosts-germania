import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";
import { confessional } from "./helpers/Confessional";
import { elisaAnimations } from "./helpers/ElisaAnimations";
import { elisaInteractionArea } from "./helpers/ElisaInteractionArea";
import { gameEvents } from "@/events/gameEvents";
import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";
import { CHARACTERS, KEY_CODES } from "@/constants/game";

export interface ElisaPayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
}

export class GhostElisa {
  private elisaSprite: Phaser.Physics.Arcade.Sprite | null = null;
  private dayActions: DayActions | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keyMap: Partial<
    Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>
  > | null = null;

  preload(scene: Phaser.Scene) {
    confessional.preload(scene);
    elisaAnimations.preload(scene);
  }

  create({ scene, startX, startY, player, dayActions, cursors }: ElisaPayload) {
    this.dayActions = dayActions || null;
    this.cursors = cursors;
    this.elisaSprite = elisaAnimations.create(scene, 130, 0);
    confessional.create(scene, this.elisaSprite, startX, startY);
    elisaInteractionArea.create(
      scene,
      player,
      this.elisaSprite,
      this.showGameMessage,
      this.closeGameMessage
    );
    this.keyMap = createKeyMap(scene, [KEY_CODES.E]);

    gameEvents.on("set-mood", ({ mood, character }) => {
      if (character === CHARACTERS.ELISA) {
        elisaAnimations.setAnimationByMood(mood);
      }
    });
  }

  showGameMessage() {
    gameEvents.emit("show-game-message", {
      title: "Fale com Eliska",
      text: 'Clique a tecla "SPACE" ou "E" no teclado para interagir com a Eliska',
    });
  }

  closeGameMessage() {
    gameEvents.emit("hide-game-message", {});
  }

  update(scene: Phaser.Scene) {
    elisaInteractionArea.update(scene);
    const { currentAnimation, previousAnimation } = elisaAnimations;

    if (this.elisaSprite && currentAnimation !== previousAnimation) {
      this.elisaSprite.play(currentAnimation, true);
      elisaAnimations.previousAnimation = currentAnimation;
    }

    if (
      elisaInteractionArea.isOverlapping &&
      (this.cursors?.space.isDown || this.keyMap?.E?.isDown)
    ) {
      this.closeGameMessage();
      this.dayActions?.onConfessionalInteraction();
    }
  }
}

export const ghostElisa = new GhostElisa();
