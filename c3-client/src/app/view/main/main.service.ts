import { Injectable } from '@angular/core';
import { RandomGen } from '@shared/game/engine/util/random-gen';
import { SessionInfo } from '@shared/model/session/session-info';
import { PixiApplication } from 'app/pixi/application';
import { IdbService } from 'app/service/idb.service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainComponent } from 'app/view/main/main.component';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

@Injectable()
export class MainService {
  sessionInfo!: SessionInfo;
  pixi!: PixiApplication;
  
  private r = new RandomGen();
  bgIndex = this.r.int(2);

  private main!: MainComponent;

  private serverInfoLoaded = false;
  private serverInfoLoadedCallbacks: any[] = [];
  runOnServerInfoLoaded(callback: any) {
    if (this.serverInfoLoaded) {
      callback();
    } else {
      this.serverInfoLoadedCallbacks.push(callback);
    }
  }
  onServerInfoLoaded() {
    this.serverInfoLoadedCallbacks.forEach(c => c());
  }
  
  constructor(
    private idbService: IdbService,
  ) { }

  init(main: MainComponent) {
    this.main = main;
  }

  openScreen(screen: MainScreen) {
    this.main.openScreen(screen);
  }

  back() {
    this.main.back();
  }
}
