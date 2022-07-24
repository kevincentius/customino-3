import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { soundService } from "app/pixi/display/sound/sound-service";



export class PlayerSound {
  constructor(private player: Player) {
    const isLocal = this.player instanceof LocalPlayer;
    let channel = isLocal ? 0 : 1;
    if (isLocal) {
      // rotate sounds
      this.player.activePiece.moveSubject.subscribe(e => {
        if (e.kick) {
          soundService.play('rotkick', channel);
        } else if (e.drot != 0) {
          soundService.play('rotate', channel);
        }
      });
    }

    this.player.pieceLockSubject.subscribe(e => {
      // lock down sound
      if (e.dropDistance > 1) {
        soundService.play('harddrop', channel);
      } else {
        soundService.play('locked', channel);
      }
      

      // line clear sounds
      if (e.clearedLines.length >= 4) {
        soundService.play('clearb2b', channel);
      } else if (e.clearedLines.length >= 3) {
        soundService.play('clearmany', channel);
      } else if (e.clearedLines.length >= 2) {
        soundService.play('cleardouble', channel);
      } else if (e.clearedLines.length >= 1) {
        soundService.play('clear', channel);
      }

      // combo sounds
      const combo = this.player.attackRule.comboTimer.combo;
      soundService.play('combolock', channel, undefined, 1 - Math.pow(Math.min(1, combo / 10), 1));
      if (e.clearedLines.length > 0) {
        if (combo == 1 && this.player.attackRule.comboTimer.lastExpiredCombo >= 5) {
          soundService.play('combotimerstart', channel);
        }
      }
    });

    // playerEngine.listenersOnLockDown.add((m, r) => {
    //   if (r.clearedLines > 0) {
    //     this.soundService.play('clear', channel);
    //     if (r.combo == 1 && this.sideRule.comboMode == ComboMode.TIMER) {
    //       this.soundService.play('combotimerstart', channel);
    //     }
    //   }

    //   if (r.clearedLines > 0 && r.combo > 1) {
    //     // skip 2 sounds
    //     this.soundService.play('combo', channel, Math.min(6, r.combo - 2));
    //   }

    //   if (r.isColorClear && sideRule.colorClearBonus != null && sideRule.colorClearBonus > 0) {
    //     this.soundService.play('colorclear', channel);
    //   }

    //   if (r.isPerfectClear && sideRule.perfectClearBonus != null && sideRule.perfectClearBonus > 0) {
    //     this.soundService.play('perfectclear', channel);
    //   }
    // });

    // playerEngine.listenersOnPieceMoveFailed.add((dy, dx, drot) => {
    //   if (drot != 0) {
    //     this.soundService.play('stuck', channel);
    //   }
    // });

    // playerEngine.listenersOnLocalHold.add(() => this.soundService.play('hold', channel));

    // // death sound always local channel
    // playerEngine.listenersOnLockOut.add(() => this.soundService.play('die', 0));

    // playerEngine.listenersOnGarbageEntered.add((numLines, isFixRate) => {
    //   if (isFixRate) {

    //   } else if (numLines < 6) {
    //     this.soundService.play('receiveone', channel);
    //   } else if (numLines < 10) {
    //     this.soundService.play('receivetwo', channel);
    //   } else if (numLines >= 10) {
    //     this.soundService.play('receivemany', channel);
    //   } else {
    //     this.soundService.play('receivespike', channel);
    //   }
    // });
  }
}
