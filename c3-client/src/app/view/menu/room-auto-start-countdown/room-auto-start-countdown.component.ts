import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { timeoutWrapper } from 'app/util/ng-zone-util';

@Component({
  selector: 'app-room-auto-start-countdown',
  templateUrl: './room-auto-start-countdown.component.html',
  styleUrls: ['./room-auto-start-countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomAutoStartCountdownComponent implements OnInit {
  @Input() countdownEndMs?: number;
  countdownTimeout: any;
  countdownValue?: number;

  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.updateCountdown(this.countdownEndMs);
  }

  updateCountdown(countdownEndMs: number | undefined) {
    clearTimeout(this.countdownTimeout);
    this.countdownTimeout = undefined;

    if (countdownEndMs == undefined) {
      this.countdownEndMs = undefined;
      this.countdownValue = undefined;
    } else {
      this.countdownValue = Math.floor((countdownEndMs - Date.now()) / 1000);
      this.cd.detectChanges();
      this.countdownEndMs = countdownEndMs;
      this.startCountdownLoop();
    }
  }

  private startCountdownLoop() {
    this.countdownTimeout = timeoutWrapper(this.ngZone)(() => {
      this.countdownLoop();
    }, 1000);
  }

  private countdownLoop() {
    if (this.countdownValue != undefined) {
      this.countdownValue--;
      this.cd.detectChanges();
  
      if (this.countdownValue > 0) {
        this.startCountdownLoop();
      }
    }
  }
}
