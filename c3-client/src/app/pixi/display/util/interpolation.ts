
export function easeOut(inSpeed: number, ms: number, initValue: number, targetValue: number) {
  const p = Math.max(0, 1.2 / (inSpeed * ms / 1000 + 1) - 0.2);
  return p * initValue + (1 - p) * targetValue;
}
