import { Dialogue } from "./components/Dialogues";
import { DreamLessonChallenges } from "./components/DreamLessonChallenges";
import { GameMessage } from "./components/GameMessage";
import { DreamIntroduction } from "./Introduction/DreamIntroduction";
import { SceneIntroduction } from "./Introduction/SceneIntroduction";
import { LessonNotebook } from "./LessonNotebook";
import { RotateOverlay } from "./RotateOverlay";
import { TrainLessonChallenges } from "./TrainLessonChallenges";

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
