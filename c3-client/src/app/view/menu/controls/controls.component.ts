import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    // console.log(this.mainService.pixi.keyboard);
  }

}
