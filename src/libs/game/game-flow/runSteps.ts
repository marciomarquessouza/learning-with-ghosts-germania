export type Context = {
  alternativeId?: string;
  setAlternativeId: (alternativeId?: string) => void;
};

export type Step = (context: Context) => Promise<void>;

export interface StepOptions {
  showWhenAlternativeIs?: string;
  when?: (context: Context) => boolean;
}

type InitialContext = {
  alternativeId?: string;
};

function createContext(initialContext: InitialContext = {}): Context {
  const context: Context = {
    alternativeId: initialContext.alternativeId,
    setAlternativeId: (alternativeId) => {
      context.alternativeId = alternativeId;
    },
  };

  return context;
}

function shouldRunStep(context: Context, options?: StepOptions): boolean {
  if (!options) {
    return true;
  }

  if (
    options.showWhenAlternativeIs &&
    context.alternativeId !== options.showWhenAlternativeIs
  ) {
    return false;
  }

  if (options.when && !options.when(context)) {
    return false;
  }

  return true;
}

export const stepBase =
  (
    stepAction: (context: Context) => void | Promise<void>,
    options?: StepOptions,
  ): Step =>
  async (context: Context) => {
    if (!shouldRunStep(context, options)) {
      return;
    }

    await stepAction(context);
  };

export async function runSteps(
  steps: Step[],
  initialContext: InitialContext = {},
): Promise<Context> {
  const context = createContext(initialContext);

  for (const step of steps) {
    await step(context);
  }

  return context;
}
