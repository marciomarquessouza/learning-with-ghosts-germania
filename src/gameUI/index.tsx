import { Dialogue } from "./Dialogues";
import { DreamLessonChallenges } from "./DreamLessonChallenges";
import { GameMessage } from "./GameMessage";
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
