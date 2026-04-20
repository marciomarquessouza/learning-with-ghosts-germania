import { Dialogue } from "./components/Dialogues";
import { DreamLessonChallenges } from "./components/DreamLessonChallenges";
import { GameActionPrompt } from "./components/GameActionPrompt";
import { GameMessage } from "./components/GameMessage";
import { WorldTransition } from "./components/Transitions/WorldTransition";
import { SceneIntroduction } from "./components/Introduction/SceneIntroduction";
import { LessonNotebook } from "./components/LessonNotebook";
import { RotateOverlay } from "./components/RotateOverlay";
import { TrainLessonChallenges } from "./components/TrainLessonChallenges";

export function GameUI() {
  return (
    <>
      <RotateOverlay />
      <SceneIntroduction />
      <WorldTransition />
      <GameMessage />
      <GameActionPrompt />
      <LessonNotebook />
      <DreamLessonChallenges />
      <TrainLessonChallenges />
      <Dialogue />
    </>
  );
}
