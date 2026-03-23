import { InputAction, InputBindings } from "./types";

export class InputController {
  private queuedActions = new Set<InputAction>();

  constructor(private bindings: InputBindings) {}

  trigger(action: InputAction) {
    this.queuedActions.add(action);
  }

  justPressed(action: InputAction): boolean {
    if (this.queuedActions.has(action)) {
      this.queuedActions.delete(action);
      return true;
    }

    const keys = this.bindings[action];
    if (!keys?.length) return false;

    return keys?.some((key) => Phaser.Input.Keyboard.JustDown(key));
  }

  isPressed(action: InputAction): boolean {
    const keys = this.bindings[action];
    if (!keys?.length) return false;

    return keys.some((key) => key.isDown);
  }

  clear() {
    this.queuedActions.clear();
  }
}
