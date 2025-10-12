export type Context = {
  alternativeId?: string;
};

export type Step = (context: Context) => Promise<void>;

export interface StepOptions {
  showWhenAlternativeIs?: string;
}

export const stepBase =
  (
    stepAction: (context: Context) => Promise<void>,
    options?: StepOptions
  ): Step =>
  async (context: Context) => {
    if (
      !!options &&
      options?.showWhenAlternativeIs &&
      context.alternativeId !== options.showWhenAlternativeIs
    ) {
      return;
    }
    await stepAction(context);
  };

export async function runSteps(steps: Step[], context: Context) {
  for (const step of steps) {
    await step(context);
  }

  return context;
}
