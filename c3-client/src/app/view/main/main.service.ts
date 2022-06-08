import { Injectable } from '@angular/core';
import { SessionInfo } from '@shared/model/session/session-info';
import { PixiApplication } from 'app/pixi/application';

@Injectable()
export class MainService {
  sessionInfo!: SessionInfo;
  pixi!: PixiApplication;
  pixiEnabled = true;
  
  displayGui = true;

  constructor() { }
}
