import { ElementRef, Injectable } from '@angular/core';
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
  pixiEnabled = true;
  
  displayGui = true;

  private r = new RandomGen();
  bgIndex = this.r.int(2);

  private main!: MainComponent;
  
  private timeout: any;
  private lastMove = Date.now();
  private moveTime = 500;
  pixiPos: Rect = { x: 0, y: 0, w: 0, h: 0 };
  private oldPos: Rect = this.pixiPos;
  private targetElement?: HTMLElement;

  gameView = false;

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

  movePixiContainer(element?: HTMLElement) {
    this.targetElement = element;
    
    if (!this.timeout) {
      this.loop();
    }
  }

  animatePixiContainer(element?: HTMLElement) {
    this.targetElement = element;
    this.lastMove = Date.now();
    this.oldPos = {
      x: this.pixiPos.x,
      y: this.pixiPos.y,
      w: this.pixiPos.w,
      h: this.pixiPos.h,
    };

    if (!this.timeout) {
      this.loop();
    }
  }

  private loop() {
    this.timeout = undefined;
    
    const p = Math.min(1, (Date.now() - this.lastMove) / this.moveTime);

    const r = this.targetElement?.getBoundingClientRect();
    this.pixiPos.x = this.interpolate(this.oldPos.x, r?.x ?? 0, p);
    this.pixiPos.y = this.interpolate(this.oldPos.y, r?.y ?? 0, p);
    this.pixiPos.w = this.interpolate(this.oldPos.w, this.targetElement?.offsetWidth ?? window.innerWidth, p);
    this.pixiPos.h = this.interpolate(this.oldPos.h, this.targetElement?.offsetHeight ?? window.innerHeight, p);
    
    this.pixi.onResize(this.pixiPos.w, this.pixiPos.h);
    
    this.timeout = setTimeout(() => this.loop());
  }

  private interpolate(oldVal: number, newVal: number, p: number) {
    p = 1 - Math.pow((1 - p), 4);
    return p * newVal + (1-p) * oldVal;
  }
}
