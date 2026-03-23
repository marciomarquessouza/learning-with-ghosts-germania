import { MovementControls } from "./types";

const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export function createMovementControls(scene: Phaser.Scene): MovementControls {
  const keyboard = scene.input.keyboard;

  if (!keyboard) {
    throw new Error("Keyboard is not available in this scene.");
  }

  return {
    left: [keyboard.addKey(KEY_CODES.LEFT), keyboard.addKey(KEY_CODES.A)],
    right: [keyboard.addKey(KEY_CODES.RIGHT), keyboard.addKey(KEY_CODES.D)],
    up: [keyboard.addKey(KEY_CODES.UP), keyboard.addKey(KEY_CODES.W)],
    down: [keyboard.addKey(KEY_CODES.DOWN), keyboard.addKey(KEY_CODES.S)],
  };
}
