import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";
import { elizaAnimations } from "./helpers/ElizaAnimations";
import { ActorPayload } from "../types/Actor";
import { createKeyMap, KeyMap } from "@/utils/createKeyMap";
import { InteractionArea } from "@/libs/game/InteractionArea";
import { IdleState } from "./states/IdleState";
import { WaitingState } from "./states/WaitingState";
import { DialogueState } from "./states/DialogueState";
import { SowingState } from "./states/SowingState";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { ELIZA_STATES } from "./states/constants";
import { createElizaInteractionArea } from "./helpers/createElizaInteractionArea";
import { events } from "@/events/events";

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

  create(scene: Phaser.Scene, payload: ElisaPayload) {
    const { dayActions, player } = payload;
    this.dayActions = dayActions ?? null;
    this.cursors = payload.cursors;
    this.sprite = elizaAnimations.create(scene, payload);
    this.keyMap = createKeyMap(scene, [KEY_CODES.K]);
    this.interactionArea = createElizaInteractionArea(scene, {
      eliza,
      player,
      onEnter: eliza.dayActions?.onEnterElizaArea,
      onLeave: () => events.game.sync.emit("hide-game-message", {}),
    });

    this.stateMachine = new StateMachine(scene);
    this.stateMachine
      .addState(ELIZA_STATES.WAITING, WaitingState, this)
      .addState(ELIZA_STATES.IDLE, IdleState, this)
      .addState(ELIZA_STATES.DIALOGUE, DialogueState, this)
      .addState(ELIZA_STATES.SOWING, SowingState, this);

    // Initial State
    this.stateMachine.changeTo(ELIZA_STATES.WAITING);
  }

  update(delta: number) {
    if (this.stateMachine) {
      this.stateMachine.updateAndHandleInput(delta);
    }
  }

  destroy() {
    this.stateMachine.clear();
    events.actors.eliza.sync.clear();
  }
}

export const eliza = new Eliza();
