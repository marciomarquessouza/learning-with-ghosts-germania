export type State<
  States extends Record<string, State<States, BaseArgs>>,
  BaseArgs extends readonly unknown[] = [],
> = {
  stateMachine: StateMachine<States, BaseArgs> | null;
  enter: (...args: BaseArgs) => void;
  execute: (...args: BaseArgs) => void;
};

export class StateMachine<
  States extends Record<string, State<States, BaseArgs>>,
  BaseArgs extends readonly unknown[] = [],
> {
  private initialState: keyof States;
  private possibleSates: States;
  private state: keyof States | null = null;
  private stateArgs: BaseArgs;

  constructor(
    initialState: keyof States,
    possibleStates: States,
    stateArgs: BaseArgs,
  ) {
    this.initialState = initialState;
    this.possibleSates = possibleStates;
    this.stateArgs = stateArgs;

    for (const state of Object.values(this.possibleSates)) {
      state.stateMachine = this;
    }
  }

  step(): void {
    if (this.state === null) {
      this.state = this.initialState;
      this.possibleSates[this.state].enter(...this.stateArgs);
    }

    this.possibleSates[this.state].execute(...this.stateArgs);
  }

  transition(newState: keyof States): void {
    this.possibleSates[newState].enter(...this.stateArgs);
  }
}
