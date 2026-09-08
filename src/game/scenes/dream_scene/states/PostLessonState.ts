import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "..";
import { PositionTrigger } from "@/libs/game/interaction/PositionTrigger";
import { BeforeReviewFlow } from "../flows/lesson/3-review/BeforeReview.flow";
import { PostLessonFlow } from "../flows/lesson/2-after_challenges/PostLesson.flow";

export class PostLessonState extends BaseState {
  private guardianTrigger?: PositionTrigger;

  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {
    this.dreamScene.flowController?.run(PostLessonFlow);

    this.dreamScene.gameCamera.zoomTo({ zoom: 1, duration: 1_000 });
    this.dreamScene.hud.setVisible(true);
    this.dreamScene.flowController?.clearNextFlow();

    if (!this.dreamScene.tutor.isDestroyed) {
      this.dreamScene.tutor.destroy();
    }

    if (this.dreamScene.knowledgeTroop.isEmpty) {
      const completedEntriesWithScores =
        this.dreamScene.lessonManager.getCompletedEntriesWithScores();
      this.dreamScene.knowledgeTroop.addByEntries(completedEntriesWithScores);
    }

    this.dreamScene.knowledgeTroop.startToFollowTarget();

    const tutorPositionX = this.dreamScene.gameCamera.camera.width + 200;

    this.guardianTrigger = new PositionTrigger(
      { targetX: tutorPositionX + 400, once: true },
      () => {
        if (!this.dreamScene.flowController) {
          this.stateMachine.log("Scene flow was not created", "error");
          return;
        }

        this.dreamScene.flowController
          .run(BeforeReviewFlow)
          .then(({ nextState }) => {
            this.changeTo(nextState ?? DreamScene.STATES.IDLE);
          })
          .catch((error) => {
            this.stateMachine.log(error, "error");
            this.changeTo(DreamScene.STATES.IDLE);
          });
      },
    );
  }

  handleInput(): void {}

  update(): void {
    const triggerX = this.dreamScene.player.sprite.x;
    this.guardianTrigger?.update(triggerX);
  }

  exit(): void {}
}
