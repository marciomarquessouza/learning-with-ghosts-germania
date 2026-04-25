import { InputController } from "./InputController";
import { InputAction, InputBindings } from "./types";

const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export function createInputController(
  scene: Phaser.Scene,
  bindings?: Partial<Record<keyof InputBindings, number[]>>,
): InputController {
  const keyboard = scene.input.keyboard;

  if (!keyboard) {
    throw new Error("Keyboard is not available in this scene");
  }

  const defaultBindings: Record<InputAction, number[]> = {
    confirm: [KEY_CODES.ENTER],
    interact: [KEY_CODES.E, KEY_CODES.SPACE],
    cancel: [KEY_CODES.ESC],
    skip: [KEY_CODES.ENTER],
    left: [KEY_CODES.LEFT, KEY_CODES.A],
    right: [KEY_CODES.RIGHT, KEY_CODES.D],
    up: [KEY_CODES.UP, KEY_CODES.W],
    down: [KEY_CODES.DOWN, KEY_CODES.S],
  };

  const mergedBindings: Record<InputAction, number[]> = {
    ...defaultBindings,
    ...bindings,
  };

  const inputBindings: InputBindings = Object.fromEntries(
    Object.entries(mergedBindings).map(([action, keyCodes]) => [
      action,
      keyCodes.map((keyCode) => keyboard.addKey(keyCode)),
    ]),
  );

  return new InputController(inputBindings);
}
