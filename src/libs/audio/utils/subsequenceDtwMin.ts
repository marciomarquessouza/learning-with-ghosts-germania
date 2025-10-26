import { dtwCost } from "./dtwCost";

export function subsequenceDtwMin(
  ref: number[][],
  usr: number[][],
  ratioMin = 0.7,
  ratioMax = 1.8
): number {
  const n = ref.length,
    m = usr.length;
  if (!n || !m) return 1.0;

  const Lmin = Math.max(3, Math.floor(n * ratioMin));
  const Lmax = Math.min(m, Math.ceil(n * ratioMax));

  if (Lmin > Lmax) {
    return 1.0;
  }

  let best = Infinity;

  const lengthStep = Math.max(1, Math.floor((Lmax - Lmin) / 15));

  for (let L = Lmin; L <= Lmax; L += lengthStep) {
    const frameStep = L > 30 ? 2 : 1;

    for (let start = 0; start + L <= m; start += frameStep) {
      const seg = usr.slice(start, start + L);
      const cost = dtwCost(ref, seg);
      if (cost < best) best = cost;

      if (best < 0.1) break;
    }
    if (best < 0.1) break;
  }

  if (best === Infinity) best = 1.0;

  return best;
}
