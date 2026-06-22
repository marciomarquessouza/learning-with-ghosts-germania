import { useGameStore } from "@/store/gameStore";
import { LessonChallenges } from "./LessonChallenges";
import { TrainControllers } from "./TrainControllers";
import { GAME_SCENES } from "@/constants/game";

export function TrainLessonChallenges() {
  const { currentScene } = useGameStore();

  if (currentScene !== GAME_SCENES.TRAIN_SCENE) {
    return null;
  }

  return (
    <>
      <TrainControllers />
      <LessonChallenges />
    </>
  );
}
