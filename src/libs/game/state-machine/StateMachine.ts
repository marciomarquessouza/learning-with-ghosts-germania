/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IState {
  enter(...args: any[]): void;
  exit(): void;
  update(delta: number): void;
  handleInput(...args: any[]): void;
  setStateMachine(stateMachine: StateMachine): void;
}

export type StateConstructor<T extends IState> = new (
  scene: Phaser.Scene,
  ...args: any[]
) => T;

export class StateMachine {
  private states: Map<string, IState> = new Map();
  private currentState: IState | null = null;
  private currentStateName: string = "";
  private previousStateName: string = "";
  private scene: Phaser.Scene;
  private onChangeState: (state: string) => void;

  constructor(
    scene: Phaser.Scene,
    options: { onStateChange?: (state: string) => void } = {},
  ) {
    this.scene = scene;
    this.onChangeState = options?.onStateChange ?? (() => {});
  }

  addState<T extends IState>(
    name: string,
    StateClass: StateConstructor<T>,
    ...args: any[]
  ): this {
    const state = new StateClass(this.scene, ...args);
    state.setStateMachine(this);
    this.states.set(name, state);
    return this;
  }

  changeTo(stateName: string, ...args: any[]): boolean {
    if (!this.states.has(stateName)) {
      console.warn(`State "${stateName}" not found`);
      return false;
    }

    const fromState = this.currentStateName;
    const toState = stateName;

    if (this.currentState) {
      this.log(fromState, "exit");
      this.currentState.exit();
      this.previousStateName = this.currentStateName;
    }

    this.log(`"${toState}"`, "enter");
    this.onChangeState(toState);

    this.currentState = this.states.get(stateName)!;
    this.currentStateName = stateName;
    this.currentState.enter(...args);

    return true;
  }

  backToPrevious(): boolean {
    if (this.previousStateName) {
      return this.changeTo(this.previousStateName);
    }
    return false;
  }

  update(delta: number): void {
    if (this.currentState) {
      this.currentState.update(delta);
    }
  }

  handleInput(...args: any[]) {
    if (this.currentState) {
      this.currentState.handleInput(...args);
    }
  }

  updateAndHandleInput(delta: number, ...inputArgs: any[]) {
    if (this.currentState) {
      this.currentState.update(delta);
      this.currentState.handleInput(inputArgs);
    }
  }

  isIn(stateName: string): boolean {
    return this.currentStateName === stateName;
  }

  getCurrentStateName(): string {
    return this.currentStateName;
  }

  getPreviousStateName(): string {
    return this.previousStateName;
  }

  removeState(stateName: string): boolean {
    return this.states.delete(stateName);
  }

  log(
    message: string | Error | unknown,
    type: "info" | "enter" | "exit" | "init" | "error" | "warn",
  ): void {
    const enabled =
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_LOGGING_ENABLE;

    if (!enabled) return;

    const timestamp = this.scene.time.now.toFixed(0);
    const prefix = `[◉→◉ StateMachine ${timestamp}ms]`;

    const styles = {
      info: "color: #3498db",
      enter: "color: #27ae60; font-weight: bold",
      exit: "color: #e67e22; font-weight: bold",
      transition: "color: #9b59b6; font-weight: bold",
      init: "color: #2ecc71; font-weight: bold",
      error: "color: #e74c3c; font-weight: bold",
      warn: "color: #f39c12",
      debug: "color: #7f8c8d",
    };

    console.log(`type: ${type} %c${prefix} ${message}`, styles[type]);
  }

  clear(): void {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.states.clear();
    this.currentState = null;
    this.currentStateName = "";
    this.previousStateName = "";
  }
}
