import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService, SoundService } from 'app/pixi/display/sound/sound-service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {

  constructor(
    private mainService: MainService,
  ) { }

  ngOnInit(): void {
  }

  onPlayClick() {
    this.mainService.openScreen(MainScreen.LOBBY);
    soundService.play('button', 0, 1);
  }

  onReplayClick() {
    this.mainService.openScreen(MainScreen.REPLAY);
    soundService.play('button', 0, 1);
  }

  onControlsClick() {
    this.mainService.openScreen(MainScreen.CONTROLS);
    soundService.play('button', 0, 1);
  }

  onThanksClick() {
    this.mainService.openScreen(MainScreen.THANKS);
    soundService.play('button', 0, 1);
  }

  onLogoutClick() {
    this.mainService.openScreen(MainScreen.LOGIN);
    musicService.stop();
    soundService.play('back');
  }
}
