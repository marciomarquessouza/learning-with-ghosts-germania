import { deltas } from "./deltas";

export function withDynamics(staticMfcc: number[][]): number[][] {
  const d1 = deltas(staticMfcc, 2);
  const d2 = deltas(d1, 2);
  return staticMfcc.map((row, i) => [...row, ...d1[i], ...d2[i]]);
}
