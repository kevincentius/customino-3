import { Component, OnInit } from '@angular/core';
import { RoomSettings } from '@shared/game/engine/model/room-settings';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {

  data!: RoomSettings;

  constructor() { }

  ngOnInit(): void {
  }

  show(actualSettings: RoomSettings) {
    console.log(JSON.stringify(actualSettings));
    this.data = JSON.parse(JSON.stringify(actualSettings));
  }
}
