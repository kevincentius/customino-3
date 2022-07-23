import { SonicDropEffectConfig } from "@shared/game/engine/model/rule/player-rule/sonic-drop-effect-config";
import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Effect } from "app/pixi/display/effects/effect";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Emitter } from "pixi-particles";
import { Container, Sprite } from "pixi.js";

export class SonicDropEffect extends Container implements Effect {
  sprite!: Sprite;

  private flashTtl: number;
  private createdAt = Date.now();
  private lastUpdate = Date.now();

  private emitter: Emitter;
  private emitterTtl;
  private particleTtl = 1500;
  private totalTtl: number;
  private initScale!: number;
  private decayFactor: number;

  constructor(
    private spritesheet: GameSpritesheet,
    private tile: Tile,
    private minoSize: number,
    private rows: number,
    private config: SonicDropEffectConfig,
  ) {
    super();

    this.flashTtl = Math.min(this.config.duration, this.config.duration / 4 * rows);
    this.emitterTtl = this.flashTtl;
    this.totalTtl = this.emitterTtl + this.particleTtl;
    this.decayFactor = Math.pow(2, this.config.decay);
    
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
        "emitterLifetime": this.emitterTtl / 1000,
        "maxParticles": this.config.particleCount,
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
    
    if (age <= this.emitterTtl) {
      const p = age / this.emitterTtl;
      this.emitter.updateSpawnPos(0, (p) * this.minoSize * this.rows);
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
