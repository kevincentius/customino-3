import { Component, OnInit } from '@angular/core';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
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
}
