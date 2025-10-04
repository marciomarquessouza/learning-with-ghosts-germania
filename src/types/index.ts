export type ChallengePhase = "hide" | "visible";

export type Challenge = {
  id: string;
  reference: string;
  challenge: string;
  phase: ChallengePhase;
};

export type Lesson = {
  id: string;
  day: number;
  title: string;
  challenges: Challenge[];
};
