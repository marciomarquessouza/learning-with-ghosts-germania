import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";

export interface ActorPayload {
  scene: Phaser.Scene;
  startX: number;
  startY: number;
  dayActions?: DayActions;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
}
