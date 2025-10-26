export function cosineCost(a: number[], b: number[]): number {
  // Inputs validation with detailed checks
  if (!a || !b || a.length === 0 || b.length === 0) {
    console.warn("cosineCost: invalid inputs", { a, b });
    return 1.0;
  }

  if (a.length !== b.length) {
    console.warn(`cosineCost: length mismatch a=${a.length} b=${b.length}`);
    // Uses the shorter length to avoid issues
    const minLen = Math.min(a.length, b.length);
    a = a.slice(0, minLen);
    b = b.slice(0, minLen);
  }

  // Filter invalid values and create safe arrays
  const safeA = a.map((x) => (typeof x === "number" && isFinite(x) ? x : 0));
  const safeB = b.map((x) => (typeof x === "number" && isFinite(x) ? x : 0));

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < safeA.length; i++) {
    const ai = safeA[i];
    const bi = safeB[i];

    dotProduct += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  // Verify boundary conditions
  if (normA < 1e-12 || normB < 1e-12) {
    // If both are zero or near zero, consider maximum similarity
    if (normA < 1e-12 && normB < 1e-12) {
      return 0.0;
    }
    return 1.0; // Maximum cost if one is zero and the other is not
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

  // Ensure the result is between 0 and 1
  return Math.max(0, Math.min(1, 1 - similarity));
}
