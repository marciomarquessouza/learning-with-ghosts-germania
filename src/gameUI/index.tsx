import { useEffect } from "react";
import { Dialogue } from "./components/Dialogues";
import { DreamLessonChallenges } from "./components/DreamLessonChallenges";
import { GameActionPrompt } from "./components/GameActionPrompt";
import { GameMessage } from "./components/GameMessage";
import { DreamIntroduction } from "./components/Introduction/DreamIntroduction";
import { SceneIntroduction } from "./components/Introduction/SceneIntroduction";
import { LessonNotebook } from "./components/LessonNotebook";
import { RotateOverlay } from "./components/RotateOverlay";
import { TrainLessonChallenges } from "./components/TrainLessonChallenges";
import { events } from "@/events/events";

export function GameUI() {
  useEffect(() => {
    const handle = () => {
      events.game.sync.emit("dialogue/hide");
      events.game.sync.emit("game-message/hide");
      events.game.sync.emit("game-action-prompt/hide");
    };
    events.game.sync.on("close-all-ui-interactions", handle);
    return () => events.game.sync.off("close-all-ui-interactions", handle);
  }, []);

  return (
    <>
      <RotateOverlay />
      <SceneIntroduction />
      <DreamIntroduction />
      <GameMessage />
      <GameActionPrompt />
      <LessonNotebook />
      <DreamLessonChallenges />
      <TrainLessonChallenges />
      <Dialogue />
    </>
  );
}
