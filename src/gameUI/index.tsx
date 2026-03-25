import { Dialogue } from "./components/Dialogues";
import { DreamLessonChallenges } from "./components/DreamLessonChallenges";
import { GameMessage } from "./components/GameMessage";
import { DreamIntroduction } from "./components/Introduction/DreamIntroduction";
import { SceneIntroduction } from "./components/Introduction/SceneIntroduction";
import { LessonNotebook } from "./components/LessonNotebook";
import { RotateOverlay } from "./components/RotateOverlay";
import { TrainLessonChallenges } from "./components/TrainLessonChallenges";

export function GameUI() {
  return (
    <>
      <RotateOverlay />
      <SceneIntroduction />
      <DreamIntroduction />
      <GameMessage />
      <LessonNotebook />
      <DreamLessonChallenges />
      <TrainLessonChallenges />
      <Dialogue />
    </>
  );
}
