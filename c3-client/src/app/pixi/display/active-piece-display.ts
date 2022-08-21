import { ActivePiece, PieceMoveEvent } from "@shared/game/engine/player/active-piece";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { BoardDisplayDelegate } from "app/pixi/display/board-display-delegate";
import { SonicDropEffect } from "app/pixi/display/effects/sonic-drop-effect";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container } from "pixi.js";

export class ActivePieceDisplay extends Container {
  minoGridDisplay?: MinoGridDisplay;
  ghostDistance = 0;
  spritesheet = new GameSpritesheet();

  activePiece: ActivePiece;

  constructor(
    private boardDisplay: BoardDisplayDelegate,
    private player: Player,
    private minoSize: number,
    private ghost=false,
  ) {
    super();

    if (this.ghost) {
      this.alpha = this.player.playerRule.graphics.ghostOpacity;
    }

    this.activePiece = this.player.activePiece;
    this.activePiece.spawnSubject.subscribe(this.onSpawn.bind(this));
    this.activePiece.moveSubject.subscribe(this.onMove.bind(this));
    this.player.board.addRowsSubject.subscribe(() => this.updatePosition());

    this.onSpawn();
    this.updatePosition();
  }

  onSpawn() {
    if (this.minoGridDisplay) {
      this.removeChild(this.minoGridDisplay);
    }

    if (this.activePiece.piece) {
      this.minoGridDisplay = new MinoGridDisplay(this.activePiece.piece.tiles, this.minoSize, 0, this.player.playerRule, this.player.playerRule.graphics.pieceGlow && this.player instanceof LocalPlayer);
      
      if (!this.ghost) {
        this.minoGridDisplay.glowFilter.innerStrength = 1;
        this.minoGridDisplay.glowFilter.outerStrength = 1;
      }

      this.addChild(this.minoGridDisplay);
      this.updatePosition();
    }
  }

  onMove(e: PieceMoveEvent) {
    if (this.minoGridDisplay) {
      if (e.drot != 0) {
        this.minoGridDisplay.rotate(e.drot);
      }
      this.updatePosition();
      
      if (!this.ghost) {
        if (e.dy > 1) {
          this.spawnSonicDropEffect(e);
        }
      }
    }
  }

  tick() {
    if (this.minoGridDisplay) {
      const p = this.player.playerRule.graphics.pieceHighlightIntensity * Math.abs(Math.sin(Date.now() * Math.PI * 2 / 1000));

      if (this.player.playerRule.graphics.pieceGlow) {
        const glow = 0.5 + p * 0.5;
        this.minoGridDisplay.glowFilter.outerStrength = glow;
        
        if (!this.ghost) {
          this.minoGridDisplay.glowFilter.innerStrength = glow;
        } else {
          this.minoGridDisplay.glowFilter.innerStrength = 0;
        }
      } else {
        
      }
    }
  }

  private spawnSonicDropEffect(e: PieceMoveEvent) {
    const tiles = this.activePiece.piece!.tiles;
    for (let j = 0; j < tiles[0].length; j++) {
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i][j];
        if (tile != null) {
          // tile is the top most mino in each column
          const minoPos = this.boardDisplay.calcMinoPosForEffect(this.activePiece.y - e.dy + i, this.activePiece.x + j);

          const combo = this.player.attackRule.comboTimer ? this.player.attackRule.comboTimer.combo : 0;
          const effect = new SonicDropEffect(this.player.playerRule.sonicDropEffect, this.spritesheet, tile, this.minoSize, e.dy + 1, combo, this.player.playerRule.graphics.particles);
          effect.position.set(minoPos.x, minoPos.y);
          this.boardDisplay.addEffectToBoard(effect);
          break;
        }
      }
    }
  }

  private updatePosition() {
    if (this.ghost) {
      this.ghostDistance = this.activePiece.calcGhostDistance();
    }

    if (this.minoGridDisplay) {
      const pos = this.boardDisplay.calcMinoPos(this.activePiece.y + this.ghostDistance, this.activePiece.x);
      this.minoGridDisplay.position.set(pos.x, pos.y);
    }
  }

  override destroy() {
    this.minoGridDisplay?.destroy();
    
    super.destroy();
  }
}
