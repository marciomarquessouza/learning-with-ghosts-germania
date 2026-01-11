import { useCallback, useEffect, useRef, useState } from "react";
import {
  LessonChallenge,
  useTrainLessonChallenges,
} from "../hooks/useTrainLesson";
import { StepPronunciation as Pronunciation } from "@/components/LessonChallenges/StepPronunciation";
import { StepWriting as Writing } from "@/components/LessonChallenges/StepWriting";
import { gameEvents } from "@/events/gameEvents";
import { ChallengeResult, StepPhases } from "@/types";
import { getChallengeScore } from "../helpers/getChallengeScore";

export function LessonChallenges() {
  const [currentChallenge, setCurrentChallenge] = useState<StepPhases>("hide");
  const { getChallenge, completeCurrentChallenge, finished } =
    useTrainLessonChallenges();
  const challenge = useRef<LessonChallenge | null>(null);
  const challengeScore = useRef(0);

  useEffect(() => {
    const handle = () => {
      if (finished) return;
      challenge.current = getChallenge();
      setCurrentChallenge(
        challenge.current?.type === "writing" ? "writing" : "pronunciation"
      );
    };
    gameEvents.on("train/challenge", handle);

    return () => {
      gameEvents.off("train/challenge", handle);
    };
  }, [getChallenge, finished]);

  const handleChallengeScore = useCallback(
    (challengeResult: ChallengeResult) => {
      setCurrentChallenge("result:analysis");
      const scoreResult = getChallengeScore(challengeResult);

      if (!scoreResult) return;

      console.log("#HERE scoreResult", scoreResult);
    },
    []
  );

  const handleCompleteChallenge = useCallback(() => {
    completeCurrentChallenge();
    setCurrentChallenge("hide");
    if (challengeScore.current > 0) {
      gameEvents.emit("train/coal:add", { amount: challengeScore.current });
      challengeScore.current = 0;
    }
  }, [challengeScore, completeCurrentChallenge]);

  if (currentChallenge === "hide") {
    return null;
  }

  return (
    <>
      {challenge.current && currentChallenge === "pronunciation" && (
        <Pronunciation
          isFirst
          isLast
          useCustomFeedback
          lessonEntry={challenge.current.entry}
          lessonStep={{
            type: "pronunciation",
            text: ``,
            instruction: `Click the mic and say: “{{audio|${challenge.current.entry.target}}}”.`,
          }}
          reproduceTargetAudioOnStart
          onResult={handleChallengeScore}
          onClickPrevious={() => {}}
          onClickNext={handleCompleteChallenge}
        />
      )}
      {challenge.current && (
        <Writing
          isLast={true}
          show={currentChallenge === "writing"}
          lessonEntry={challenge.current.entry}
          lessonStep={{
            type: "writing",
            text: ``,
            instruction: "",
          }}
          reproduceTargetAudioOnStart
          onResult={handleChallengeScore}
          onClickPrevious={() => {}}
          onClickNext={handleCompleteChallenge}
        />
      )}
    </>
  );
}
