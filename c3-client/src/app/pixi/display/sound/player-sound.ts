import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { PlayerDisplay } from "app/pixi/display/player-display";
import { soundService } from "app/pixi/display/sound/sound-service";



export class PlayerSound {
  channel: number;

  constructor(
    private player: Player,
    private playerDisplay: PlayerDisplay,
  ) {
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
      if (this.player.attackRule.comboTimer) {
        this.player.attackRule.comboTimer.comboEndedSubject.subscribe(combo => {
          if (combo >= 1) {
            soundService.play('combotimerend', this.channel);
          }
        });
      }

      // countdown (TODO: spectator = no sound?)
      this.playerDisplay.getCountdownSubject().subscribe(count => {
        if (count > 0) {
          soundService.play('countdown', this.channel, 0);
        } else {
          soundService.play('countdown', this.channel, 1);
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
    });
    
    if (this.player.attackRule.comboTimer) {
      // combo sounds
      this.player.pieceLockSubject.subscribe(e => {
        const combo = this.player.attackRule.comboTimer!.combo;
        soundService.play('combolock', this.channel, undefined, 1 - Math.pow(Math.min(1, combo / 13), 1));
      });

      this.player.attackRule.comboTimer.comboIncreasedSubject.subscribe(combo => {
        if (combo == 3) {
          soundService.play('combo', this.channel, 0);
        } else if (combo == 5) {
          soundService.play('combo', this.channel, 1);
        } else if (combo == 7) {
          soundService.play('combo', this.channel, 2);
        } else if (combo == 9) {
          soundService.play('combo', this.channel, 3);
        } else if (combo == 11) {
          soundService.play('combo', this.channel, 4);
        }
      });
    }

    this.player.attackRule.starsSubject.subscribe(e => {
      console.log('playing stars sound');
      soundService.play('stars', this.channel);
    });
  }
}
