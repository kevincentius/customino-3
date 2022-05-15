import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PixiApplication } from 'app/pixi/application';

@Component({
  selector: 'app-pixi',
  templateUrl: './pixi.component.html',
  styleUrls: ['./pixi.component.scss']
})
export class PixiComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  pixiApplication!: PixiApplication;

  constructor() { }

  ngOnInit(): void {
    this.pixiApplication = new PixiApplication(this.canvas.nativeElement);
  }

}
