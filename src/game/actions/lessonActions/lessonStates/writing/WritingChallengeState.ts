import { LessonActions } from "@/gameUI/DreamLessonChallenges/hooks/reducers/lessonReducer";
import { BaseState } from "@/libs/game/state-machine/BaseState";

export class PronunciationChallengeState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
