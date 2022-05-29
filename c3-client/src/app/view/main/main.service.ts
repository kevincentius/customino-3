import { Injectable } from '@angular/core';
import { PixiApplication } from 'app/pixi/application';

@Injectable()
export class MainService {
  pixi!: PixiApplication;
  
  displayGui = true;

  constructor() { }
}
