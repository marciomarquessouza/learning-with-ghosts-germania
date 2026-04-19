import { Flow } from "./Flow";
import { FlowClass, FlowResult, ScheduledFlow } from "./types";

interface FlowControllerPayload<TState extends string, TGameScene> {
  scene: Phaser.Scene;
  gameScene: TGameScene;
  cancelFlow: FlowClass<TState, TGameScene>;
  onRunScheduledFlow: (state?: TState) => void;
}

export class FlowController<TState extends string, TGameScene> {
  private scene: Phaser.Scene;
  private gameScene: TGameScene;
  private currentFlow?: Flow<TState, TGameScene>;
  private nextFlow?: FlowClass<TState, TGameScene>;
  private cancelFlow: FlowClass<TState, TGameScene>;
  private scheduledFlows: ScheduledFlow<TState, TGameScene>[] = [];
  private queuedFlows: FlowClass<TState, TGameScene>[] = [];
  private onRunScheduledFlow: (state?: TState) => void;
  private flowTimeoutsToClear = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();

  constructor({
    scene,
    gameScene,
    cancelFlow,
    onRunScheduledFlow,
  }: FlowControllerPayload<TState, TGameScene>) {
    this.scene = scene;
    this.gameScene = gameScene;
    this.cancelFlow = cancelFlow;
    this.onRunScheduledFlow = onRunScheduledFlow;
  }

  getNextFlow() {
    return this.nextFlow;
  }

  setNextFlow(flow: FlowClass<TState, TGameScene>) {
    this.nextFlow = flow;
  }

  clearNextFlow() {
    this.nextFlow = undefined;
  }

  getCurrentFlow() {
    return this.currentFlow;
  }

  async run(
    FlowClass: FlowClass<TState, TGameScene>,
  ): Promise<FlowResult<TState, TGameScene>> {
    const flow = new FlowClass({
      scene: this.scene,
      gameScene: this.gameScene,
    });

    this.currentFlow = flow;

    const result: FlowResult<TState, TGameScene> = await flow.run();

    this.applyFlowResult(result);

    if (this.currentFlow === flow) {
      flow.destroy();
      this.currentFlow = undefined;
    }

    return result;
  }

  runCancelFlow() {
    this.run(this.cancelFlow);
  }

  addScheduledFlows(newScheduledFlows: ScheduledFlow<TState, TGameScene>[]) {
    this.scheduledFlows = [...this.scheduledFlows, ...newScheduledFlows];
  }

  private runScheduledFlows() {
    const flowsToRun = [...this.scheduledFlows];
    this.scheduledFlows = [];
    flowsToRun.forEach(({ id, delayMs, FlowClass, mode, state }) => {
      const timeout = setTimeout(() => {
        this.clearFlowTimeout(id);
        const currentFlow = this.getCurrentFlow();
        if (currentFlow && mode === "queue") {
          this.queuedFlows.push(FlowClass);
          return;
        }
        this.nextFlow = FlowClass;
        this.onRunScheduledFlow(state);
      }, delayMs);
      this.flowTimeoutsToClear.set(id, timeout);
    });
  }

  applyFlowResult(result: {
    nextFlow?: FlowClass<TState, TGameScene>;
    scheduledFlows?: ScheduledFlow<TState, TGameScene>[];
    cancelFlow?: FlowClass<TState, TGameScene>;
  }) {
    const { nextFlow, scheduledFlows, cancelFlow } = result;

    this.nextFlow = nextFlow;
    this.cancelFlow = cancelFlow ?? this.cancelFlow;
    this.addScheduledFlows(scheduledFlows ?? []);
    this.runScheduledFlows();
  }

  private clearFlowTimeout(flowId: string) {
    const timeout = this.flowTimeoutsToClear.get(flowId);
    if (timeout) {
      clearTimeout(timeout);
      this.flowTimeoutsToClear.delete(flowId);
    }
  }

  public hasQueuedFlows() {
    return this.queuedFlows.length > 0;
  }

  public runQueuedFlow(): Promise<FlowResult<TState, TGameScene>> | void {
    const nextFlow = this.queuedFlows.shift();
    if (!nextFlow) return;

    return this.run(nextFlow);
  }
}
