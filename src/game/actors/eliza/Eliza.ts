import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";
import { elizaAnimations } from "./helpers/ElizaAnimations";
import { gameEvents } from "@/events/gameEvents";
import { ActorPayload } from "../types/Actor";
import { createKeyMap, KeyMap } from "@/utils/createKeyMap";
import { InteractionArea } from "@/libs/game/InteractionArea";
import { IdleState } from "./states/IdleState";
import { WaitingState } from "./states/WaitingState";
import { DialogueState } from "./states/DialogueState";
import { SowingState } from "./states/SowingState";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { ELIZA_STATES } from "./states/constants";

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export interface ElisaPayload extends ActorPayload {
  player: Phaser.Types.Physics.Arcade.ArcadeColliderType;
  camera: Phaser.Cameras.Scene2D.Camera;
}

export class Eliza {
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public interactionArea!: InteractionArea;
  public dayActions: DayActions | null = null;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public keyMap!: KeyMap;
  private stateMachine!: StateMachine;

  preload(scene: Phaser.Scene) {
    elizaAnimations.preload(scene);
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
    this.dayActions = dayActions ?? null;
    this.cursors = cursors;
    this.sprite = elizaAnimations.create(scene, startX, startY, flipX, scale);
    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);

    this.interactionArea = new InteractionArea();
    this.interactionArea.create(scene, {
      player,
      target: this.sprite,
      width: 500,
      height: 400,
      offsetX: -180,
      onEnter: dayActions?.onEnterElizaArea,
      onLeave: () => gameEvents.emit("hide-game-message", {}),
    });

    this.stateMachine = new StateMachine(scene);
    this.stateMachine
      .addState(ELIZA_STATES.WAITING, WaitingState, this)
      .addState(ELIZA_STATES.IDLE, IdleState, this)
      .addState(ELIZA_STATES.DIALOGUE, DialogueState, this)
      .addState(ELIZA_STATES.SOWING, SowingState, this);

    this.stateMachine.changeTo(ELIZA_STATES.WAITING);
  }

  update(delta: number) {
    if (this.stateMachine) {
      this.stateMachine.updateAndHandleInput(delta);
    }
  }

  destroy() {
    this.stateMachine.clear();
  }
}

export const eliza = new Eliza();
