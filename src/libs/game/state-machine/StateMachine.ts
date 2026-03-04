/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IState {
  enter(...args: any[]): void;
  exit(): void;
  update(delta: number): void;
  handleInput(...args: any[]): void;
  setStateMachine(stateMachine: StateMachine): void;
}

export type StateConstructor<T extends IState> = new (...args: any[]) => T;

export class StateMachine extends Phaser.Events.EventEmitter {
  private states: Map<string, IState> = new Map();
  private currentState: IState | null = null;
  private currentStateName: string = "";
  private previousStateName: string = "";
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    super();
    this.scene = scene;
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

    const fromState = this.currentState;
    const toState = stateName;

    if (this.currentState) {
      this.currentState.exit();
      this.previousStateName = this.currentStateName;
    }

    this.currentState = this.states.get(stateName)!;
    this.currentStateName = stateName;
    this.currentState.enter(...args);

    this.emit("stateChanged", {
      from: fromState,
      to: toState,
      timestamp: this.scene.time.now,
      args: args,
    });

    this.emit(`state:${toState}`, {
      from: fromState,
      args,
    });

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

  updateAndHandleInput(delta: number, ...inputArgs: any[]) {
    if (this.currentState) {
      this.currentState.update(delta);
      this.currentState.handleInput(inputArgs);
    }
  }

  handleInput(...args: any[]) {
    if (this.currentState) {
      this.currentState.handleInput(...args);
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
