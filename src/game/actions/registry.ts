import { DayActions } from "./actionDefaultPerDay/default.actions";

export const dayImporters: Record<
  number,
  () => Promise<{ dayAction: DayActions }>
> = {
  1: () => import("./actionOverridesPerDay/day_01/day_01.actions"),
};
