import { events } from "@/events/events";
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

interface CreatePayload {
  startX: number;
  startY: number;
  flipX: boolean;
}

export class LearningNode {
  public static readonly STATES = LEARNING_NODE_STATES;

  public animations = new Animations();
  public references: {
    groundPositionY: number;
    handPositionX: number;
    handPositionY: number;
  } | null = null;
  public stateMachine!: StateMachine;
  public eventController!: EventController<
    LearningNodeSyncEvents,
    LearningNodeAsyncEvents
  >;
  public audioPlayButton = new AudioPlayButton();
  public lessonTargetLabel = new LessonTargetLabel();
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
    this.audioPlayButton.preload(scene);
  }

  create(scene: Phaser.Scene, { startX, startY, flipX }: CreatePayload) {
    this.sprite = scene.physics.add
      .sprite(startX, startY, "", "")
      .setFlipX(!!flipX)
      .setVisible(false);
    const groundPositionY = startY;
    const handPositionY = groundPositionY - 360;
    this.references = {
      handPositionX: startX,
      groundPositionY,
      handPositionY,
    };

    this.animations.create(scene, this.sprite);

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
      .addState(LearningNode.STATES.SPROUT_TALKING, SproutTalkingState, this);
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

  attachPlayerButton(onClick: () => void) {
    this.audioPlayButton.attach({
      target: this.sprite,
      position: "bottom",
      onClick,
      offset: -20,
    });
    this.audioPlayButton.setVisible(true);
  }

  attachTargetLabel(targetText: string, onComplete?: () => void) {
    this.lessonTargetLabel.typeText({ text: targetText, onComplete });
    this.lessonTargetLabel.attach({
      target: this.sprite,
      position: "top",
    });
    this.lessonTargetLabel.setVisible(true);
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
