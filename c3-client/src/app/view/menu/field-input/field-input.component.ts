import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayerRuleField } from '@shared/game/engine/model/rule/field';
import { FieldType } from '@shared/game/engine/model/rule/field-type';

@Component({
  selector: 'app-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss']
})
export class FieldInputComponent implements OnInit {
  @Input() field!: PlayerRuleField;
  @Input() fieldValue: any;
  @Output() fieldValueChange = new EventEmitter<any>();

  FieldType = FieldType;

  inpValue: any;
  validationErrorMessages: (string | undefined)[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.inpValue = this.fieldValue;
  }

  onInputChange() {
    this.validationErrorMessages = this.field.validators ? this.field.validators.map(v => v(this.inpValue)).filter(m => !!m) : [];
    
    if (this.validationErrorMessages.length == 0) {
      this.fieldValueChange.emit(this.getValue());
    }
  }

  private getValue() {
    switch (this.field.fieldType) {
      case FieldType.NUMBER:
        return parseFloat(this.inpValue);

      case FieldType.CHOICE:
        return this.inpValue;
      
      case FieldType.NUMBER_LIST:
        return this.inpValue.split(',').map((inpItem: string) => parseFloat(inpItem));

      default:
        throw new Error();
    }
  }
}
