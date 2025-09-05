/* eslint-disable @typescript-eslint/no-empty-object-type */
type Context = {};

export type Step = (context: Context) => Promise<void>;

export async function runSteps(steps: Step[], context: Context) {
  for (const step of steps) {
    await step(context);
  }
}
