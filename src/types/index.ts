export type ChallengePhase = "hide" | "visible";

export type Challenge = {
  id: string;
  reference: string;
  challenge: string;
  phase: ChallengePhase;
};

export type Lesson = {
  id: string;
  title: string;
  challenges: Challenge[];
};
