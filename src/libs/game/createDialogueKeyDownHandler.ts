interface DialogueKeyHandlers {
  keyAction?: () => void;
  keyUp?: () => void;
  keyDown?: () => void;
  keyLeft?: () => void;
  keyRight?: () => void;
}

interface Options {
  enabled?: boolean
}

export const createDialogueKeyDownHandler =
  (handlers: DialogueKeyHandlers, { enabled = true }: Options = {}) =>
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!enabled || e.repeat) return;

    const el = e.target as HTMLElement;
    const tag = el.tagName;
    const type = (el as HTMLInputElement).type?.toLowerCase?.() || "";

    const isTypingField =
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (tag === "INPUT" &&
        !["radio", "checkbox", "button", "submit"].includes(type)) ||
      el.isContentEditable;

    if (isTypingField) return;

    const key = e.key.toLowerCase();
    const code = e.code;

    if (
      key === "enter" ||
      key === " " ||
      key === "space" ||
      key === "spacebar"
    ) {
      e.preventDefault();
      handlers.keyAction?.();
      return;
    }

    const keyMap: Record<string, (() => void) | undefined> = {
      ArrowUp: handlers.keyUp,
      KeyW: handlers.keyUp,
      ArrowDown: handlers.keyDown,
      KeyS: handlers.keyDown,
      ArrowLeft: handlers.keyLeft,
      KeyA: handlers.keyLeft,
      ArrowRight: handlers.keyRight,
      KeyD: handlers.keyRight,
    };

    const callback = keyMap[code];
    if (callback) {
      e.preventDefault();
      callback();
    }
  };
