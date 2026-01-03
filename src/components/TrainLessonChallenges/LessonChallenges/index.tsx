import { useEffect, useState } from "react";
import { useTrainLessonChallenges } from "../hooks/useTrainLesson";
import { StepPronunciation } from "@/components/LessonChallenges/StepPronunciation";
import { StepWriting } from "@/components/LessonChallenges/StepWriting";
import { gameEvents } from "@/events/gameEvents";
import { LessonChallengePhase, LessonEntry } from "@/types";

export function LessonChallenges() {
  const [currentChallenge, setCurrentChallenge] =
    useState<LessonChallengePhase>("hide");
  const { getLessonEntry, completeCurrentChallenge, finished } =
    useTrainLessonChallenges();
  const [lessonEntry, setLessonEntry] = useState<Omit<
    LessonEntry,
    "steps"
  > | null>(null);

  useEffect(() => {
    const handle = ({
      challengePhase,
    }: {
      challengePhase: LessonChallengePhase;
    }) => {
      if (finished) return;
      setLessonEntry(getLessonEntry());
      setCurrentChallenge(challengePhase);
    };
    gameEvents.on("train/challenge", handle);

    return () => {
      gameEvents.off("train/challenge", handle);
    };
  }, [getLessonEntry, finished]);

  const handleCompleteChallenge = (isCorrect: boolean) => {
    completeCurrentChallenge();
    if (isCorrect) {
      gameEvents.emit("train/coal:add", { amount: 5 });
    }
    setCurrentChallenge("hide");
  };

  if (currentChallenge === "hide") {
    return null;
  }

  return (
    <>
      {currentChallenge === "pronunciation" && lessonEntry && (
        <StepPronunciation
          lessonEntry={lessonEntry}
          lessonStep={{
            type: "pronunciation",
            text: ``,
            instruction: "Click the mic and say: “{{audio|Hallo}}”.",
          }}
          onClickPrevious={() => {}}
          onClickNext={() => {}}
          onResult={handleCompleteChallenge}
        />
      )}
      {currentChallenge === "writing" && lessonEntry && (
        <StepWriting
          isLast={true}
          lessonEntry={lessonEntry}
          lessonStep={{
            type: "writing",
            text: ``,
            instruction: "",
          }}
          onClickNext={() => {}}
          onClickPrevious={() => {}}
          onResult={handleCompleteChallenge}
        />
      )}
    </>
  );
}
