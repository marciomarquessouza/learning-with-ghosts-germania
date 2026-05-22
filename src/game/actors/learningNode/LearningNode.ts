import { events } from "@/events/events";
import { getRequired } from "@/utils/getRequired";

import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { EventController } from "@/libs/events/EventController";
import {
  LearningNodeAsyncEvents,
  LearningNodeSyncEvents,
} from "@/events/actors/learningNode/events";
import { LEARNING_NODE_STATES } from "./constants/states";
import { LearningNodeAnimations as Animations } from "./animations/LearningNodeAnimations";
import { AudioPlayButton } from "./components/AudioPlayButton";
import { LessonTargetLabel } from "./components/LessonTargetLabel";

import { SproutingState } from "./states/sprout/SproutingState";
import { SproutTalkingState } from "./states/sprout/SproutTalkingState";
import { SproutIdleState } from "./states/sprout/SproutIdleState";
import { PumpkinIdleState } from "./states/pumpkin/PumpkinIdleState";
import { PumpkinTransition } from "./states/pumpkin/PumpkinTransitionState";
import { FloorAnimations } from "./animations/FloorAnimations";
import { SeedAnimations } from "./animations/SeedAnimations";

interface CreatePayload {
  startX: number;
  startY: number;
  flipX: boolean;
}

export class LearningNode {
  public static readonly STATES = LEARNING_NODE_STATES;

  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _container?: Phaser.GameObjects.Container;

  public animations = new Animations();
  public stateMachine!: StateMachine;
  public eventController!: EventController<
    LearningNodeSyncEvents,
    LearningNodeAsyncEvents
  >;
  public audioPlayButton = new AudioPlayButton();
  public lessonTargetLabel = new LessonTargetLabel();
  public floor = new FloorAnimations();
  public seed = new SeedAnimations();

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "LearningNode", "_scene");
  }

  private get container(): Phaser.GameObjects.Container {
    return getRequired(this._container, "LearningNode", "_container");
  }

  public get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return getRequired(this._sprite, "LearningNode", "_sprite");
  }

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
    this.audioPlayButton.preload(scene);
    this.floor.preload(scene);
  }

  create(scene: Phaser.Scene, { startX, startY, flipX }: CreatePayload) {
    this._scene = scene;

    const learningNodeX = startX - 160;
    const learningNodeY = startY;

    this._container = scene.add.container(learningNodeX - 80, startY);

    this._sprite = scene.physics.add
      .sprite(learningNodeX, learningNodeY, "", "")
      .setFlipX(!!flipX)
      .setVisible(false);

    const handPositionY = startY - 360;

    this.animations.create(scene, this.sprite);

    this.seed.create(scene, {
      x: learningNodeX,
      startY: handPositionY + 40,
      groundY: startY,
    });

    this.floor.create(scene, this.container);

    this.audioPlayButton.create(scene);
    this.audioPlayButton.setVisible(false);

    this.lessonTargetLabel.create(scene);
    this.lessonTargetLabel.setVisible(false);

    this.eventController = new EventController(
      events.actors.learningNode.sync,
      events.actors.learningNode.async,
    );

    this.stateMachine = new StateMachine(scene);
    this.stateMachine
      .addState(LearningNode.STATES.SPROUTING, SproutingState, this)
      .addState(LearningNode.STATES.SPROUT_IDLE, SproutIdleState, this)
      .addState(LearningNode.STATES.SPROUT_TALKING, SproutTalkingState, this)
      .addState(LearningNode.STATES.PUMPKIN_TRANSITION, PumpkinTransition, this)
      .addState(LearningNode.STATES.PUMPKIN_IDLE, PumpkinIdleState, this);
  }

  public enterSproutingState() {
    this.stateMachine.changeTo(LearningNode.STATES.SPROUTING);
  }

  public enterIdleState() {
    this.stateMachine.changeTo(LearningNode.STATES.SPROUT_IDLE);
  }

  public enterSproutTalkingState() {
    this.stateMachine.changeTo(LearningNode.STATES.SPROUT_TALKING);
  }

  public enterPumpkinTransitionState() {
    this.stateMachine.changeTo(LearningNode.STATES.PUMPKIN_TRANSITION);
  }

  public enterPumpkinIdleState() {
    this.stateMachine.changeTo(LearningNode.STATES.PUMPKIN_IDLE);
  }

  public preparePumpkinGrowth() {
    this.animations.preparePumpkinReveal({
      spritePosition: { x: this.sprite.x, y: this.sprite.y },
      containerPosition: { x: this.container.x, y: this.container.y },
      debug: false,
    });
  }

  public growPumpkinTo(progress: number) {
    return this.animations.growPumpkinTo(progress);
  }

  public increasePumpkinGrowth(amount = 0.25) {
    return this.animations.increasePumpkinGrowth(amount);
  }

  attachPlayerButton(onClick: () => void) {
    this.audioPlayButton.attach({
      target: this.sprite,
      position: "bottom",
      onClick,
      offset: 20,
    });
    this.audioPlayButton.setVisible(true);
  }

  detachPlayerButton() {
    this.audioPlayButton.setVisible(false);
    this.audioPlayButton.destroy();
  }

  attachTargetLabel(targetText: string, onComplete?: () => void) {
    this.lessonTargetLabel.typeText({ text: targetText, onComplete });
    this.lessonTargetLabel.attach({
      target: this.sprite,
      position: "top",
      offset: -150,
    });
    this.lessonTargetLabel.setVisible(true);
  }

  detachTargetLabel() {
    this.lessonTargetLabel.setVisible(false);
    this.lessonTargetLabel.destroy();
  }

  increaseSize() {
    this.scene.tweens.killTweensOf(this.sprite);

    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: this.sprite.scaleX + 0.2,
      scaleY: this.sprite.scaleY + 0.2,
      duration: 350,
      ease: "Back.easeOut",
    });
  }

  update(delta: number) {
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.animations.destroy();
    this.stateMachine.clear();
    this.eventController.offAllEvents();
    this.audioPlayButton.destroy();
    this.lessonTargetLabel.destroy();
  }
}
