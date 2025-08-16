import { DayActions } from "../defaultActions";

export const dayImporters: Record<
  number,
  () => Promise<{ dayAction: DayActions }>
> = {
  1: () => import("./day-1"),
};
