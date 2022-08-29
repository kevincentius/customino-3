import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { musicService } from 'app/pixi/display/sound/music-service';
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
  }

  onReplayClick() {
    this.mainService.openScreen(MainScreen.REPLAY);
  }

  onControlsClick() {
    this.mainService.openScreen(MainScreen.CONTROLS);
  }

  onThanksClick() {
    this.mainService.openScreen(MainScreen.THANKS);
  }

  onLogoutClick() {
    this.mainService.openScreen(MainScreen.LOGIN);
    musicService.stop();
  }
}
