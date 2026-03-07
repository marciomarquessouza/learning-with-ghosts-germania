import { LessonActions } from "@/gameUI/DreamLessonChallenges/hooks/reducers/lessonReducer";
import { BaseState } from "@/libs/game/state-machine/BaseState";

export class LessonStartState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private lessonActions: LessonActions,
  ) {
    super(scene);
  }

  enter(): void {
    // TODO: Lesson Controller: setCurrentLessonEntry
    // TODO: Lesson Challenges: state: idle
    // TODO: Eliza: state: idle
    // TODO: Josef: state: idle
    // TODO: Krampus: state: idle
    // TODO: Pumpkin Kid: state: destroyed
    // TODO: Lesson Header: Show Title
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
