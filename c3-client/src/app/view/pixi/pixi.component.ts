import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PixiApplication } from 'app/pixi/application';
import { IdbService } from 'app/service/idb.service';
import { UserSettingsService } from 'app/service/user-settings/user-settings.service';

@Component({
  selector: 'app-pixi',
  templateUrl: './pixi.component.html',
  styleUrls: ['./pixi.component.scss']
})
export class PixiComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  pixiApplication!: PixiApplication;

  constructor(
    private userSettingsService: UserSettingsService,
  ) { }

  ngOnInit(): void {
    this.pixiApplication = new PixiApplication(this.canvas.nativeElement, this.userSettingsService);
  }

}
