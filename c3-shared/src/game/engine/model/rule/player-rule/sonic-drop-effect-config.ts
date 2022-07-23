
export interface SonicDropEffectConfig {
  duration: number;
  decay: number;

  particleCount: number;
  particleOpacity: number;
  particleScale: number;
  particleDuration: number;
  particleSpeed: number;
  particleMaxAngle: number;
  particleSaturation: number;
  particleBrightness: number;

  comboCap: number,
  comboBrightnessMultiplier: number,
  comboDecayDivisor: number,
  comboParticleCountMultiplier: number,
}