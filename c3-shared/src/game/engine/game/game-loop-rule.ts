
const fps = 60;

export const gameLoopRule = {
  mspf: 1000 / fps,
  fps: fps,
  maxCatchUpRate: 10,
  maxDelay: 500,
}
