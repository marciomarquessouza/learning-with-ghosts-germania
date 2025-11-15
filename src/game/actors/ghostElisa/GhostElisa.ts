import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";
import { confessional } from "./helpers/Confessional";
import { elisaAnimations } from "./helpers/ElisaAnimations";
import { elisaInteractionArea } from "./helpers/ElisaInteractionArea";
import { gameEvents } from "@/events/gameEvents";
import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";
import { CHARACTERS } from "@/constants/game";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { lessonEvents } from "@/events/lessonEvents";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export interface ElisaPayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  camera: Phaser.Cameras.Scene2D.Camera;
}

export class GhostElisa {
  public lockInteractions = false;
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
    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);

    gameEvents.on("set-mood", ({ mood, character }) => {
      if (character === CHARACTERS.ELISA) {
        elisaAnimations.setAnimationByMood(mood);
      }
    });

    lessonEvents.on("show-lesson", () => {
      this.keyMap = createKeyMap(scene, []);
      this.lockInteractions = true;
    });

    lessonEvents.on("hide-lesson", () => {
      this.keyMap = createKeyMap(scene, [KEY_CODES.E]);
      this.lockInteractions = false;
    });
  }

  showGameMessage() {
    gameEvents.emit("show-game-message", {
      title: "Talk to Eliska",
      text: 'Press the "SPACE" or "E" key on your keyboard to interact with Eliska',
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
      !this.lockInteractions &&
      elisaInteractionArea.isOverlapping &&
      (this.cursors?.space.isDown || this.keyMap?.E?.isDown)
    ) {
      gameEvents.emit("hide-hud-items", [
        HUD_ITEMS.WEIGHT,
        HUD_ITEMS.THERMOMETER,
      ]);
      this.closeGameMessage();
      gameEvents.emit("camera-zoom-to", { zoom: 1.2, duration: 200 });
      this.dayActions?.onConfessionalInteraction();
    }
  }
}

export const ghostElisa = new GhostElisa();
