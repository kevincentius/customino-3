import { Effect } from "app/pixi/display/effects/effect";
import { getLocalSettings } from "app/service/user-settings/user-settings.service";
import { Emitter } from "pixi-particles";
import { Container, Texture } from "pixi.js";

export class MinoDestroyedEffect extends Container implements Effect {
  
  private spawnMs = Date.now();
  private pow = 3;

  private ttl = 1000;

  private emitter?: Emitter;

  private config = {
    particleOpacity: 0.25,
    particleScale: 0.1,
    particleSpeed: 500,
    particleDuration: 1000,
    particleAccel: 4000,

  };

  constructor(
    width: number,
    height: number,
    private texture: Texture,
  ) {
    texture = Texture.WHITE;
    super();

    if (getLocalSettings().localGraphics.particles) {
      this.emitter = new Emitter(this, this.texture, 
        {
          "alpha": {
            "start": this.config.particleOpacity,
            "end": this.config.particleOpacity
          },
          "scale": {
            "start": this.config.particleScale * width / this.texture.width,
            "end": this.config.particleScale * width / this.texture.width,
            "minimumScaleMultiplier": 1
          },
          "color": {
            "start": "#ffffff",
            "end": "#ffffff"
          },
          "speed": {
            "start": this.config.particleSpeed,
            "end": this.config.particleSpeed,
            "minimumSpeedMultiplier": 1
          },
          "acceleration": {
            "x": 0,
            "y": this.config.particleAccel,
          },
          "maxSpeed": 0,
          "startRotation": {
            "min": 0,
            "max": 360,
          },
          "noRotation": true,
          "rotationSpeed": {
            "min": 225,
            "max": 315,
          },
          "lifetime": {
            "min": this.ttl / 1000,
            "max": this.ttl / 1000,
          },
          "blendMode": "add",
          "frequency": 0.001,
          "emitterLifetime": 0.1,
          "maxParticles": 5,
          "pos": {
            "x": 0,
            "y": 0,
          },
          "addAtBack": false,
          "spawnType": "rect",
          "spawnRect": {
            "x": 0,
            "y": 0,
            "w": this.width,
            "h": this.height,
          }
        }
      );
    }
  }

  tick(dt: number): boolean {
    const p = (Date.now() - this.spawnMs) / this.ttl;
    if (p >= 1) {
      return false;
    } else {
      if (this.emitter) {
        this.emitter.update(dt / 1000);
      }
      return true;
    }
  }

  override destroy() {
    this.emitter?.destroy();

    super.destroy();
  }
}
