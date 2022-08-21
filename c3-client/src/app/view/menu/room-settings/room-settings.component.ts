import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomSettings } from '@shared/game/engine/model/room-settings';
import { FieldTags } from '@shared/game/engine/model/rule/data-field/field-tag';
import { playerRuleFields } from '@shared/game/engine/model/rule/room-rule/player-rule-fields';
import { DataFieldCategoryData } from 'app/view/menu/rule-settings/rule-settings-category';

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

  dataFields = playerRuleFields;
  dataFieldCategories: DataFieldCategoryData[] = [
    {
      name: 'General',
      tag: FieldTags.GENERAL,
    },
    {
      name: 'Attack',
      tag: FieldTags.ATTACK,
    },
    {
      name: 'Defense',
      tag: FieldTags.DEFENSE,
    },
    {
      name: 'Debug',
      tag: FieldTags.DEBUG,
    },
    {
      name: 'Others',
    }
  ];
  
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
