import { Component, Input, OnInit } from '@angular/core';
import { DataField } from '@shared/game/engine/model/rule/data-field/data-field';
import { FieldType } from '@shared/game/engine/model/rule/data-field/field-type';

@Component({
  selector: 'app-field-output',
  templateUrl: './field-output.component.html',
  styleUrls: ['./field-output.component.scss']
})
export class FieldOutputComponent implements OnInit {
  @Input() field!: DataField;
  @Input() fieldValue: any;

  FieldType = FieldType;

  constructor() { }

  ngOnInit(): void {
  }

  getChoiceLabel() {
    return this.field.choices!.find(choice => choice.value == this.fieldValue)!.label;
  }
}
