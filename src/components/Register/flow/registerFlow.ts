const REGISTER_PATHS = [
  "/register/challenge",
  "/register/player-language",
  "/register/level",
] as const;

type RegisterPath = (typeof REGISTER_PATHS)[number];

type RegisterFlowDetails = {
  isFirst: boolean;
  isLast: boolean;
  previous?: RegisterPath;
  next?: RegisterPath;
};

export function getRegisterFlow(path: string): RegisterFlowDetails {
  const index = REGISTER_PATHS.indexOf(path as RegisterPath);

  return {
    isFirst: index === 0,
    isLast: index === REGISTER_PATHS.length - 1,
    previous: REGISTER_PATHS[index - 1],
    next: REGISTER_PATHS[index + 1],
  };
}
