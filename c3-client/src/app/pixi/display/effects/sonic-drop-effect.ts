import { SonicDropEffectConfig } from "@shared/game/engine/model/rule/player-rule/sonic-drop-effect-config";
import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Effect } from "app/pixi/display/effects/effect";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { AdjustmentFilter } from "pixi-filters";
import { Emitter } from "pixi-particles";
import { Container, Sprite } from "pixi.js";

export class SonicDropEffect extends Container implements Effect {
  sprite!: Sprite;

  private flashTtl: number;
  private createdAt = Date.now();
  private lastUpdate = Date.now();

  private emitter: Emitter;
  private particleTtl;
  private totalTtl: number;
  private initScale!: number;
  private decayFactor: number;

  constructor(
    private config: SonicDropEffectConfig,
    private spritesheet: GameSpritesheet,
    private tile: Tile,
    private minoSize: number,
    private rows: number,
    private combo: number,
  ) {
    super();

    const comboMultiplier = Math.min(1, this.combo / this.config.comboCap);
    this.filters = [this.createAdjustmentFilter(comboMultiplier)];

    this.flashTtl = Math.min(this.config.duration, this.config.duration / 4 * rows);
    this.particleTtl = this.config.particleDuration;
    this.totalTtl = Math.max(this.flashTtl, this.particleTtl);
    this.decayFactor = Math.pow(2, this.config.decay) / (1 + Math.pow(comboMultiplier, 3) * (this.config.comboDecayDivisor - 1));
    
    if (this.tile.type == TileType.FILLED) {
      this.createSprite(this.tile.color);
    } else if (this.tile.type == TileType.GARBAGE) {
      this.createSprite(7);
    } else {
      throw new Error('Unknown tile type.');
    }

    this.addChild(this.sprite);

    this.emitter = new Emitter(this, this.sprite.texture, 
      {
        "alpha": {
          "start": this.config.particleOpacity,
          "end": 0.1
        },
        "scale": {
          "start": this.config.particleScale,
          "end": 0,
          "minimumScaleMultiplier": 0.5
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
          "y": -this.config.particleSpeed / (this.config.particleDuration / 1000 * 0.75)
        },
        "maxSpeed": 0,
        "startRotation": {
          "min": 90 - this.config.particleMaxAngle,
          "max": 90 + this.config.particleMaxAngle,
        },
        "noRotation": false,
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": this.particleTtl / 1000,
          "max": this.particleTtl / 1000
        },
        "blendMode": "normal",
        "frequency": 0.001,
        "emitterLifetime": 0.1,
        "maxParticles": this.config.particleCount * (1 + comboMultiplier * (this.config.comboParticleCountMultiplier - 1)),
        "pos": {
          "x": 0,
          "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
          "x": 0,
          "y": 0,
          "w": this.minoSize,
          "h": this.minoSize * this.rows,
        }
      }
    );
  }

  createAdjustmentFilter(comboMultiplier: number) {
    const brightnessMultiplier = 1 + (this.config.comboBrightnessMultiplier - 1) * comboMultiplier;

    return new AdjustmentFilter({
      saturation: this.config.particleSaturation,
      brightness: this.config.particleBrightness * brightnessMultiplier,
    });
  }
  
  tick(): boolean {
    const ct = Date.now();
    const dt = ct - this.lastUpdate;
    this.lastUpdate = ct;

    const age = ct - this.createdAt;
    if (age <= this.flashTtl) {
      const p = age / this.flashTtl;
      this.sprite.alpha = Math.pow(1 - p, this.decayFactor);

      const py = Math.pow(p, 1 / this.decayFactor);
      this.sprite.scale.y = this.initScale * (1 - py);
      this.sprite.position.y = this.minoSize * this.rows * py;
    } else {
      this.sprite.alpha = 0;
    }
    
    if (age <= this.totalTtl) {
      this.emitter.update(dt / 1000);
    } else {
      return false;      
    }
    
    return true;
  }

  private createSprite(textureMinoId: number) {
    const scale = this.minoSize / this.spritesheet.mino[0].width;
    this.initScale = scale * this.rows;

    this.sprite = new Sprite(this.spritesheet.mino[textureMinoId]);
    this.sprite.scale.set(scale, this.initScale);
  }
}
