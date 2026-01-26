import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LessonChallenge,
  useTrainLessonChallenges,
} from "../hooks/useTrainLesson";
import { StepPronunciation as Pronunciation } from "@/gameUI/LessonChallenges/StepPronunciation";
import { StepWriting as Writing } from "@/gameUI/LessonChallenges/StepWriting";
import { StepFeedback as Feedback } from "../../LessonChallenges/StepFeedback";
import { gameEvents } from "@/events/gameEvents";
import { ChallengeCommand, ChallengeResult, StepPhases } from "@/types";
import {
  ChallengeScoreResult,
  getChallengeScore,
} from "../helpers/getChallengeScore";

type ActiveChallengeState = {
  phase: StepPhases;
  challenge: LessonChallenge | null;
  command: ChallengeCommand | null;
  score: ChallengeScoreResult | null;
};

const initialState: ActiveChallengeState = {
  phase: "hide",
  challenge: null,
  command: null,
  score: null,
};

export function LessonChallenges() {
  const { getChallenge, completeCurrentChallenge, finished } =
    useTrainLessonChallenges();

  const [state, setState] = useState<ActiveChallengeState>(initialState);

  const pronunciationStep = useMemo(() => {
    if (!state.challenge) return null;
    return {
      type: "pronunciation" as const,
      text: "",
      instruction: `Click the mic and say: “{{audio|${state.challenge.entry.target}}}”.`,
    };
  }, [state.challenge]);

  const writingStep = useMemo(() => {
    if (!state.challenge) return null;
    return {
      type: "writing" as const,
      text: "",
      instruction: "",
    };
  }, [state.challenge]);

  useEffect(() => {
    const handle = ({ command }: { command: ChallengeCommand }) => {
      if (finished) return;

      const next = getChallenge();
      if (!next) return;

      setState({
        phase: next.type === "writing" ? "writing" : "pronunciation",
        challenge: next,
        command,
        score: null,
      });
    };

    gameEvents.on("train/challenge", handle);
    return () => gameEvents.off("train/challenge", handle);
  }, [finished, getChallenge]);

  const handleChallengeScore = useCallback(
    (challengeResult: ChallengeResult) => {
      setState((prev) => {
        if (!prev.command) return prev;

        return {
          ...prev,
          score: getChallengeScore(prev.command, challengeResult),
          phase: "result:feedback",
        };
      });
    },
    []
  );

  const handleCompleteChallenge = useCallback(() => {
    switch (state.score?.type) {
      case "hate":
        gameEvents.emit("krampus/hate", { hate: state.score.value });
        break;
      case "coal":
        gameEvents.emit("train/coal:add", { amount: state.score.value });
        break;
      case "attack":
        gameEvents.emit("train/attack:arrow", { power: state.score.value });
        break;
    }
    completeCurrentChallenge();
    setState(initialState);
  }, [completeCurrentChallenge, state.score?.type, state.score?.value]);

  const showPronunciation = state.phase === "pronunciation";
  const showWriting = state.phase === "writing";
  const showFeedback = state.phase === "result:feedback";

  const hasChallenge = Boolean(state.challenge);

  if (!state.challenge?.entry) {
    return null;
  }

  return (
    <>
      <Pronunciation
        show={hasChallenge && showPronunciation}
        isFirst
        isLast
        useCustomFeedback
        lessonEntry={state.challenge?.entry}
        lessonStep={
          pronunciationStep ?? {
            type: "pronunciation",
            text: "",
            instruction: "",
          }
        }
        reproduceTargetAudioOnStart={hasChallenge && showPronunciation}
        onResult={handleChallengeScore}
        onClickPrevious={() => {}}
        onClickNext={handleCompleteChallenge}
      />

      <Writing
        isLast
        show={hasChallenge && showWriting}
        lessonEntry={state.challenge?.entry}
        lessonStep={
          writingStep ?? { type: "writing", text: "", instruction: "" }
        }
        reproduceTargetAudioOnStart={hasChallenge && showWriting}
        onResult={handleChallengeScore}
        onClickPrevious={() => {}}
        onClickNext={handleCompleteChallenge}
      />

      <Feedback
        show={showFeedback}
        score={state.score}
        onFinish={handleCompleteChallenge}
      />
    </>
  );
}
