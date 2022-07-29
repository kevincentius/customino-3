import { ActivePiece, PieceMoveEvent } from "@shared/game/engine/player/active-piece";
import { Player } from "@shared/game/engine/player/player";
import { EffectContainer } from "app/pixi/display/effects/effect-container";
import { MinoFlashEffect } from "app/pixi/display/effects/mino-flash-effect";
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
    private boardMinoGridDisplay: MinoGridDisplay,
    private effectContainer: EffectContainer,
    private player: Player,
    private minoSize: number,
    private ghost=false,
  ) {
    super();

    if (this.ghost) {
      this.alpha = 0.2;
    }

    this.activePiece = this.player.activePiece;
    this.activePiece.spawnSubject.subscribe(this.onSpawn.bind(this));
    this.activePiece.moveSubject.subscribe(this.onMove.bind(this));

    this.onSpawn();
    this.updatePosition();
  }

  onSpawn() {
    if (this.minoGridDisplay) {
      this.removeChild(this.minoGridDisplay);
    }

    if (this.activePiece.piece) {
      this.minoGridDisplay = new MinoGridDisplay(this.activePiece.piece.tiles, this.minoSize);
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

  private spawnSonicDropEffect(e: PieceMoveEvent) {
    const tiles = this.activePiece.piece!.tiles;
    for (let j = 0; j < tiles[0].length; j++) {
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i][j];
        if (tile != null) {
          // tile is the top most mino in each column
          const minoPos = this.boardMinoGridDisplay.calcMinoPos(this.activePiece.y - e.dy + i, this.activePiece.x + j);

          const effect = new SonicDropEffect(this.player.playerRule.sonicDropEffect, this.spritesheet, tile, this.minoSize, e.dy + 1, this.player.attackRule.comboTimer.combo);
          effect.position.set(minoPos.x, minoPos.y);
          this.effectContainer.addEffect(effect);
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
      const pos = this.boardMinoGridDisplay.calcMinoPos(this.activePiece.y + this.ghostDistance, this.activePiece.x);
      this.minoGridDisplay.position.set(pos.x, pos.y);
    }
  }
}
