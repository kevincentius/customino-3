import { Component, Input, OnInit } from '@angular/core';
import { RoomSettings } from '@shared/game/engine/model/room-settings';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {

  data!: RoomSettings;
  @Input() editMode = false;

  constructor() { }

  ngOnInit(): void {
  }

  show(actualSettings: RoomSettings) {
    this.data = undefined!;
    setTimeout(() => {
      this.data = JSON.parse(JSON.stringify(actualSettings));
    });
  }

  getData() {
    return this.data;
  }
}
