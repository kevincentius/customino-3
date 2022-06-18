import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    public mainService: MainService
  ) { }

  ngOnInit(): void {
  }

}