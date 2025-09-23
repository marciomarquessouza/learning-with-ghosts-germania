export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;
type KeyCodeNames = keyof typeof Phaser.Input.Keyboard.KeyCodes;

/**
 * Keyboard Map.
 * Check if the keyboard is available (desktop).
 *
 * @param scene - Current Phaser Scene
 * @param keys - Array of keyCodes of Phaser.Input.Keyboard.KeyCodes
 * @returns Key Maps
 */
export function createKeyMap(
  scene: Phaser.Scene,
  codes: number[]
): Partial<Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>> {
  if (!scene.input.keyboard) {
    throw new Error("Mobile/Tablet version not implemented");
  }

  const keyMap: Partial<Record<KeyCodeNames, Phaser.Input.Keyboard.Key>> = {};

  const entries = Object.entries(Phaser.Input.Keyboard.KeyCodes) as [
    KeyCodeNames,
    number
  ][];

  const codeToName = new Map<number, KeyCodeNames>(
    entries.map(([name, code]) => [code, name])
  );

  codes.forEach((code) => {
    const keyName = codeToName.get(code);
    if (keyName) {
      keyMap[keyName] = scene.input.keyboard!.addKey(code);
    }
  });

  return keyMap;
}
