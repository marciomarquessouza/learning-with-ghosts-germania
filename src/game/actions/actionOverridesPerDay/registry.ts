import { DayActions } from "../default.actions";

export const dayImporters: Record<
  number,
  () => Promise<{ dayAction: DayActions }>
> = {
  1: () => import("./day_01.actions"),
};
