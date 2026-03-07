import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";

export interface ActorPayload {
  startX: number;
  startY: number;
  scale?: number;
  flipX?: boolean;
  dayActions?: DayActions;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
}
