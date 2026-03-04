/* eslint-disable @typescript-eslint/no-explicit-any */
import { IState, StateMachine } from "./StateMachine";

export abstract class BaseState implements IState {
  protected stateMachine!: StateMachine;

  setStateMachine(stateMachine: StateMachine): void {
    this.stateMachine = stateMachine;
  }

  abstract enter(...args: any[]): void;
  abstract exit(): void;
  abstract update(delta: number): void;
  abstract handleInput(...args: any[]): void;

  protected changeTo(stateName: string, ...args: any[]): void {
    this.stateMachine.changeTo(stateName, ...args);
  }

  protected isIn(stateName: string): boolean {
    return this.stateMachine.isIn(stateName);
  }
}
