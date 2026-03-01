import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";
import { elisaAnimations } from "./helpers/ElisaAnimations";
import { gameEvents } from "@/events/gameEvents";
import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";
import { CHARACTERS } from "@/constants/game";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { lessonEvents, SowingEvent } from "@/events/lessonEvents";
import { InteractionArea } from "@/libs/game/InteractionArea";
import { onAnimationFrame } from "@/libs/animation/onAnimationFrame";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export interface ElisaPayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  camera: Phaser.Cameras.Scene2D.Camera;
}

export class GhostElisa {
  public lockInteractions = false;
  private elisaSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
    null;
  private elisaInteractionArea: InteractionArea | null = null;
  private dayActions: DayActions | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keyMap: Partial<
    Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>
  > | null = null;

  preload(scene: Phaser.Scene) {
    elisaAnimations.preload(scene);
  }

  create({
    scene,
    startX,
    startY,
    scale,
    flipX,
    player,
    dayActions,
    cursors,
  }: ElisaPayload) {
    this.dayActions = dayActions || null;
    this.cursors = cursors;
    this.elisaSprite = elisaAnimations.create(scene, startX, startY);
    this.elisaSprite.flipX = !!flipX;
    this.elisaSprite.scale = scale || 1;

    this.elisaInteractionArea = new InteractionArea();
    this.elisaInteractionArea.create(scene, {
      player,
      target: this.elisaSprite,
      width: 500,
      height: 400,
      // Shadow compensation
      offsetX: -180,
      onEnter: dayActions?.onEnterElizaArea,
      onLeave: () => gameEvents.emit("hide-game-message", {}),
    });

    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);

    gameEvents.on("set-mood", ({ mood, character }) => {
      if (character === CHARACTERS.ELISA) {
        elisaAnimations.setAnimationByMood(mood);
      }
    });

    const handleSowing = ({ onFinish }: SowingEvent) => {
      if (this.elisaSprite) {
        const animation = elisaAnimations.animations.GAS_MASK_NUN_SOWING_ANIM;
        this.elisaSprite.play(animation);
        onAnimationFrame(this.elisaSprite, animation, 20, () => onFinish());
      } else {
        console.error("elisaSprite is not available");
      }
    };

    lessonEvents.on("eliza/lesson:sowing", handleSowing);

    lessonEvents.on("show-lesson", () => {
      this.keyMap = createKeyMap(scene, []);
      this.lockInteractions = true;
    });

    lessonEvents.on("hide-lesson", () => {
      this.keyMap = createKeyMap(scene, [KEY_CODES.E]);
      this.lockInteractions = false;
    });

    this.elisaSprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      lessonEvents.off("eliza/lesson:sowing", handleSowing);
    });
  }

  update() {
    this.elisaInteractionArea?.update();
    const { currentAnimation, previousAnimation } = elisaAnimations;

    if (this.elisaSprite && currentAnimation !== previousAnimation) {
      this.elisaSprite.play(currentAnimation, true);
      elisaAnimations.previousAnimation = currentAnimation;
    }

    if (
      !this.lockInteractions &&
      this.elisaInteractionArea?.isOverlapping &&
      (this.cursors?.space.isDown || this.keyMap?.E?.isDown)
    ) {
      gameEvents.emit("hide-hud-items", [
        HUD_ITEMS.WEIGHT,
        HUD_ITEMS.THERMOMETER,
      ]);
      gameEvents.emit("hide-game-message", {});
      gameEvents.emit("camera-zoom-to", { zoom: 1.2, duration: 200 });
      this.dayActions?.onConfessionalInteraction();
    }
  }
}

export const ghostElisa = new GhostElisa();
