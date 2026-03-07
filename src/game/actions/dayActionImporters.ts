import { DayActions } from "./dailyActions/actionDefaultPerDay/default.actions";

export const dayActionImporters: Record<
  number,
  () => Promise<{ dayAction: DayActions }>
> = {
  1: () => import("./dailyActions/actionOverridesPerDay/day_01/day_01.actions"),
};
