type PositionTriggerOptions = {
  targetX: number;
  once?: boolean;
};

export class PositionTrigger {
  private once = false;
  private targetX: number;

  public triggered = false;

  constructor(
    { targetX, once }: PositionTriggerOptions,
    private onTrigger: () => void,
  ) {
    this.once = !!once;
    this.targetX = targetX;
  }

  update(currentX: number) {
    if (currentX >= this.targetX) {
      if (this.once && this.triggered) {
        return;
      }

      this.triggered = true;

      this.onTrigger();
    }
  }

  reset() {
    this.triggered = false;
    this.once = false;
  }
}
