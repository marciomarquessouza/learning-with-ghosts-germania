export type InputAction = "interact" | "confirm" | "cancel" | "skip";

export type InputBindings = Partial<
  Record<InputAction, Phaser.Input.Keyboard.Key[]>
>;

export interface MovementControls {
  left: Phaser.Input.Keyboard.Key[];
  right: Phaser.Input.Keyboard.Key[];
  up: Phaser.Input.Keyboard.Key[];
  down: Phaser.Input.Keyboard.Key[];
}
