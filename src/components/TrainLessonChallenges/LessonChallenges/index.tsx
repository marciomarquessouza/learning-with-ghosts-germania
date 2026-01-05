import { useCallback, useEffect, useRef, useState } from "react";
import {
  LessonChallenge,
  useTrainLessonChallenges,
} from "../hooks/useTrainLesson";
import { StepPronunciation as Pronunciation } from "@/components/LessonChallenges/StepPronunciation";
import { StepWriting as Writing } from "@/components/LessonChallenges/StepWriting";
import { gameEvents } from "@/events/gameEvents";
import { ChallengeResult, LessonChallengePhase } from "@/types";
import { getChallengeScore } from "../helpers/getChallengeScore";

export function LessonChallenges() {
  const [currentChallenge, setCurrentChallenge] =
    useState<LessonChallengePhase>("hide");
  const { getChallenge, completeCurrentChallenge, finished } =
    useTrainLessonChallenges();
  const [challenge, setChallenge] = useState<LessonChallenge | null>(null);
  const challengeScore = useRef(0);

  useEffect(() => {
    const handle = ({
      challengePhase,
    }: {
      challengePhase: LessonChallengePhase;
    }) => {
      if (finished) return;
      setChallenge(getChallenge());
      setCurrentChallenge(challengePhase);
    };
    gameEvents.on("train/challenge", handle);

    return () => {
      gameEvents.off("train/challenge", handle);
    };
  }, [getChallenge, finished]);

  const handleChallengeScore = useCallback((challengeResult: ChallengeResult) => {
    const scoreResult = getChallengeScore(challengeResult);

    if (!scoreResult) return

    
  }, []);

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
      {challenge && challenge?.type === "pronunciation" && (
        <Pronunciation
          isFirst
          isLast
          useCustomFeedback
          lessonEntry={challenge.entry}
          lessonStep={{
            type: "pronunciation",
            text: ``,
            instruction: `Click the mic and say: “{{audio|${challenge.entry.target}}}”.`,
          }}
          reproduceTargetAudioOnStart
          onResult={handleChallengeScore}
          onClickPrevious={() => {}}
          onClickNext={handleCompleteChallenge}
        />
      )}
      {challenge && challenge?.type === "writing" && (
        <Writing
          isLast={true}
          lessonEntry={challenge.entry}
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
