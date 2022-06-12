import { Injectable } from '@angular/core';
import { RandomGen } from '@shared/game/engine/util/random-gen';
import { SessionInfo } from '@shared/model/session/session-info';
import { PixiApplication } from 'app/pixi/application';
import { IdbService } from 'app/service/idb.service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainComponent } from 'app/view/main/main.component';

@Injectable()
export class MainService {
  sessionInfo!: SessionInfo;
  pixi!: PixiApplication;
  pixiEnabled = true;
  
  displayGui = true;

  private r = new RandomGen();
  bgIndex = this.r.int(2);

  private main!: MainComponent;

  constructor(
    private idbService: IdbService,
  ) { }

  init(main: MainComponent) {
    this.main = main;
  }

  openScreen(screen: MainScreen) {
    this.main.openScreen(screen);
  }
}
