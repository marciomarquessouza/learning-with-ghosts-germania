import { ActorPayload } from "../types/Actor";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { TUTOR_STATES } from "./constants/states";
import { TutorAnimations } from "./animations/TutorAnimations";
import { createTutorStateMachine } from "./helpers/createTutorStateMachine";
import { getRequired } from "@/utils/getRequired";
import { TutorBlockerZone } from "./zones/TutorBlockerZone";
import { ACTORS } from "@/constants/game";
import { events } from "@/events/events";
import { InteractionLine } from "@/libs/dialogues/types";

export class Tutor {
  public static readonly STATES = TUTOR_STATES;

  private _container?: Phaser.GameObjects.Container;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private stateMachine!: StateMachine;
  private blockerZone = new TutorBlockerZone();
  private resolveSowing: (() => void) | null = null;

  public animations = new TutorAnimations();

  public get container(): Phaser.GameObjects.Container {
    return getRequired(this._container, "Tutor", "_container");
  }

  public get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return getRequired(this._sprite, "Tutor", "_sprite");
  }

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
  }

  create(scene: Phaser.Scene, payload: ActorPayload) {
    const { startX, startY, scale, flipX } = payload;

    this._container = scene.add.container(startX, startY);

    this._sprite = scene.physics.add
      .sprite(0, 0, "", "")
      .setFlipX(!!flipX)
      .setScale(scale || 1);

    this.container.add(this._sprite);

    this.blockerZone.create(scene, {
      x: this.container.x - 40,
      y: this.container.y - 50,
      width: 220,
      height: 560,
      debug: false,
    });

    this.animations.create(scene, this.sprite);

    this.stateMachine = createTutorStateMachine(scene, this);
    this.stateMachine.changeTo(Tutor.STATES.IDLE);
  }

  async dialogue(content: string | string[]): Promise<void> {
    if (typeof content === "string") {
      return events.game.async.emitAsync("dialogue/show", {
        lines: [
          {
            type: "dialogue",
            text: content,
            character: ACTORS.TUTOR,
          },
        ],
      });
    }
    const lines: InteractionLine[] = content.map((text) => ({
      type: "dialogue",
      text,
      character: ACTORS.TUTOR,
    }));
    return events.game.async.emitAsync("dialogue/show", {
      lines,
    });
  }

  enterIdle() {
    this.stateMachine.changeTo(Tutor.STATES.IDLE);
  }

  enterTeaching() {
    this.stateMachine.changeTo(Tutor.STATES.TEACHING);
  }

  async waitForSowing(): Promise<void> {
    return new Promise((resolve) => {
      this.resolveSowing = resolve;
      this.stateMachine.changeTo(Tutor.STATES.SOWING);
    });
  }

  finishSowing() {
    this.resolveSowing?.();
    this.resolveSowing = null;
  }

  addCollisionWithPlayer(player: Phaser.Physics.Arcade.Sprite) {
    this.blockerZone.addCollisionWith(player);
  }

  refreshBlockerArea() {
    this.blockerZone.refreshBody();
  }

  update(delta: number) {
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.stateMachine.clear();
  }
}
