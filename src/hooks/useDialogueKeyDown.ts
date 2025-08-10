interface DialogueKeyHandlers {
  keyAction?: () => void;
  keyUp?: () => void;
  keyDown?: () => void;
  keyLeft?: () => void;
  keyRight?: () => void;
}

export const useDialogueKeyDown =
  (handlers: DialogueKeyHandlers) =>
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.repeat) return;

    const tag = (e.target as HTMLElement).tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return;
    }

    const key = e.key.toLowerCase();
    const code = e.code;

    if (key === "enter" || key === " " || key === "spacebar") {
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
