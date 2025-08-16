import { useCellStore } from "@/store/cellStore";
import { DayActions, defaultDayActions } from "./defaultActions";
import { dayImporters } from "./actionOverridesPerDay/registry";

const cache = new Map<number, DayActions>();

export async function getDayAction(): Promise<DayActions> {
  const day = useCellStore.getState().day;
  if (cache.has(day)) return cache.get(day)!;

  const importer = dayImporters[day];
  if (!importer) {
    cache.set(day, defaultDayActions);
    return defaultDayActions;
  }

  try {
    const dayActionModule = await importer();
    const actions: DayActions = dayActionModule.dayAction ?? defaultDayActions;
    cache.set(day, actions);
    return actions;
  } catch (error) {
    console.error(error);
    cache.set(day, defaultDayActions);
    return defaultDayActions;
  }
}
