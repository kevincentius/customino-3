import { Component, Input, OnInit } from '@angular/core';
import { PlayerRuleField } from '@shared/game/engine/model/rule/field';
import { FieldType } from '@shared/game/engine/model/rule/field-type';

@Component({
  selector: 'app-field-output',
  templateUrl: './field-output.component.html',
  styleUrls: ['./field-output.component.scss']
})
export class FieldOutputComponent implements OnInit {
  @Input() field!: PlayerRuleField;
  @Input() fieldValue: any;

  FieldType = FieldType;

  constructor() { }

  ngOnInit(): void {
  }

}
