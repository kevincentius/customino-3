import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { soundService } from "app/pixi/display/sound/sound-service";



export class PlayerSound {
  channel: number;

  constructor(private player: Player) {
    const isLocal = this.player instanceof LocalPlayer;
    this.channel = isLocal ? 0 : 1;
    
    if (isLocal) {
      // rotate sounds
      this.player.activePiece.moveSubject.subscribe(e => {
        if (e.kick) {
          soundService.play('rotkick', this.channel);
        } else if (e.drot != 0) {
          soundService.play('rotate', this.channel);
        }
      });
      
      // combo timer end
      this.player.attackRule.comboTimer.comboEndedSubject.subscribe(combo => {
        if (combo >= 1) {
          soundService.play('combotimerend', this.channel);
        }
      });
    }

    this.player.pieceLockSubject.subscribe(e => {
      // lock down sound
      if (e.dropDistance > 1) {
        soundService.play('harddrop', this.channel);
      } else {
        soundService.play('locked', this.channel);
      }
      

      // line clear sounds
      if (e.clearedLines.length >= 4) {
        soundService.play('clearb2b', this.channel);
      } else if (e.clearedLines.length >= 3) {
        soundService.play('clearmany', this.channel);
      } else if (e.clearedLines.length >= 2) {
        soundService.play('cleardouble', this.channel);
      } else if (e.clearedLines.length >= 1) {
        soundService.play('clear', this.channel);
      }

      // combo sounds
      const combo = this.player.attackRule.comboTimer.combo;
      soundService.play('combolock', this.channel, undefined, 1 - Math.pow(Math.min(1, combo / 13), 1));
    });
  }
}
