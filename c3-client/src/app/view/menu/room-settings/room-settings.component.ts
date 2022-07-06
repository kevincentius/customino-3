import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomSettings } from '@shared/game/engine/model/room-settings';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {
  @Output() save = new EventEmitter<RoomSettings>();
  @Output() cancel = new EventEmitter();

  data!: RoomSettings;
  @Input() currentSettings!: RoomSettings;
  @Input() editMode = false;

  constructor() { }

  ngOnInit(): void {
    this.data = JSON.parse(JSON.stringify(this.currentSettings));
  }

  onSaveClick() {
    this.save.emit(this.data);
  }

  onCancelClick() {
    this.cancel.emit();
  }
}
