import { ghostJosef } from "../../actors/ghostJosef/GhostJosef";
import { createScene } from "@/game/core/CreateScene";
import { hud, HUD_ITEMS } from "../hud";
import { cemeteryScenario } from "./helpers/cemeteryScenario";
import { getDayAction } from "@/game/actions/getAction";
import { ghostElisa } from "@/game/actors/ghostElisa/GhostElisa";
import { dreamCamera } from "@/game/cameras/DreamCamera";
import { gameEvents } from "@/events/gameEvents";
import { changeWorldTransition } from "@/game/utils/changeWorldTransition";
import { krampus } from "@/game/actors/krampus/Krampus";
import { krampusAnimations } from "@/game/actors/krampus/helpers/KrampusAnimation";
import { GAME_SCENES } from "@/constants/game";
import { GameScenes } from "@/types";
import { dangerZone } from "./helpers/dangerZone";
import { crackAnimation } from "./helpers/crackAnimation";

export const DEFAULT_POSITION_X = 510;
export const DEFAULT_POSITION_Y = 720;

class GhostDreamScene extends Phaser.Scene {
  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
  }

  preload() {
    dangerZone.preload(this);
    cemeteryScenario.preload(this);
    ghostJosef.preload(this);
    ghostElisa.preload(this);
    krampus.preload(this);
    crackAnimation.preload(this);

    this.physics.world.setBounds(0, 0, 2000, 1200);
    hud.preload(this);
  }

  create() {
    const scenario = cemeteryScenario.create(this);
    if (!this.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");
    const cursors = this.input.keyboard?.createCursorKeys();
    this.physics.world.setBounds(0, 0, scenario.width - 200, scenario.height);
    const ghostSprite = ghostJosef.create({
      scene: this,
      startX: DEFAULT_POSITION_X,
      startY: DEFAULT_POSITION_Y,
      cursors,
    });

    dreamCamera.create(this, ghostSprite, {
      x: 0,
      y: 0,
      width: scenario.width,
      height: scenario.height,
    });

    krampus.create(this, {
      // Off screen
      startX: -250,
      startY: DEFAULT_POSITION_Y - 25,
      initialSpeed: 0,
      scale: 1.5,
      initialAnimation: krampusAnimations.animations.KRAMPUS_WALKING,
    });

    dangerZone.create(this, {
      startX: 1400,
      startY: 470,
      player: ghostSprite,
      onEnter: () => console.log("#INSIDE"),
      onLeave: () => console.log("#OUTSIDE"),
    });

    crackAnimation.create(this, scenario.width - 790, 900);

    getDayAction(this.scene.key as GameScenes).then((dayActions) => {
      ghostElisa.create({
        scene: this,
        startX: scenario.width - 800,
        startY: DEFAULT_POSITION_Y - 55,
        scale: 0.65,
        flipX: true,
        player: ghostSprite,
        dayActions,
        cursors,
        camera: dreamCamera.mainCamera,
      });
      const hudContainer = hud.create(this, dayActions, [HUD_ITEMS.WEIGHT]);
      this.children.bringToTop(hudContainer);

      dreamCamera.fadeIn({ onComplete: () => dayActions.onStart() });
    });

    gameEvents.on("krampus/released", () => {
      krampus.setX(1500);
    });

    gameEvents.on("change-world-transition", ({ afterClose }) => {
      changeWorldTransition(this, afterClose);
    });
  }

  onKrampusReleased() {}

  update(time: number, delta: number) {
    cemeteryScenario.update(delta);
    ghostJosef.update(time, delta);
    dangerZone.update();
    ghostElisa.update();
  }

  destroy() {
    cemeteryScenario.destroy();
    hud.destroy();
    crackAnimation.destroy();
  }
}

export const ghostDreamScene = createScene(GhostDreamScene);
