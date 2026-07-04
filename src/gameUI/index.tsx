import { Dialogue } from "./components/Dialogues";
import { GameActionPrompt } from "./components/GameActionPrompt";
import { GameMessage } from "./components/GameMessage";
import { WorldTransition } from "./components/Transitions/WorldTransition";
import { SceneIntroduction } from "./components/Introduction/SceneIntroduction";
import { LessonNotebook } from "./components/LessonNotebook";
import { RotateOverlay } from "./components/RotateOverlay";
import { TrainLessonChallenges } from "./components/TrainLessonChallenges";
import { LessonHeader } from "./components/LessonHeader/LessonHeader";
import { WritingBoard } from "./components/WritingBoard";
import { LessonFooter } from "./components/LessonFooter";

export function GameUI() {
  return (
    <>
      <RotateOverlay />
      <SceneIntroduction />
      <WorldTransition />
      <GameMessage />
      <GameActionPrompt />
      <LessonNotebook />
      <LessonHeader />
      <LessonFooter />
      <WritingBoard />
      <TrainLessonChallenges />
      <Dialogue />
    </>
  );
}
