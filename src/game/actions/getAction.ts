import { useGameStore } from "@/store/gameStore";
import {
  DayActions,
  defaultDayActions,
} from "./actionDefaultPerDay/default.actions";
import { dayImporters } from "./registry";
import { GameScenes } from "@/types";

const cache = new Map<number, DayActions>();

function withScene(actions: DayActions, scene: GameScenes): DayActions {
  actions.scene = scene;
  return actions;
}

export async function getDayAction(scene: GameScenes): Promise<DayActions> {
  const day = useGameStore.getState().day;

  const cached = cache.get(day);
  if (cached) return withScene(cached, scene);

  const importer = dayImporters[day];
  if (!importer) {
    cache.set(day, defaultDayActions);
    return withScene(defaultDayActions, scene);
  }

  try {
    const dayActionModule = await importer();
    const base = (dayActionModule.dayAction ?? defaultDayActions) as DayActions;
    cache.set(day, base);

    return withScene(base, scene);
  } catch (error) {
    console.error(error);
    cache.set(day, defaultDayActions);
    return withScene(defaultDayActions, scene);
  }
}
