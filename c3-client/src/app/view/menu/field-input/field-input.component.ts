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
  errors: (string | undefined)[] = [];

  scrollTimeout: any;
  scrollDelay = 250;
  scrollRepeatInteveral = 50;

  constructor() {
  }

  ngOnInit(): void {
    this.inpValue = this.fieldValue;
  }

  onInputChange() {
    this.errors = this.field.validators ? this.field.validators.map(v => v(this.inpValue)).filter(m => !!m) : [];
    
    if (this.errors.length == 0) {
      this.fieldValueChange.emit(this.getValue());
    }
  }

  startScroll(sign: number) {
    if (this.validate(this.fieldValue + sign)) {
      this.fieldValue += sign;
      this.fieldValueChange.emit(this.fieldValue);
    }
    this.scrollTimeout = setTimeout(() => this.scrollLoop(sign), this.scrollDelay);
  }

  endScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = undefined;
    }
  }

  scrollLoop(sign: number) {
    if (this.validate(this.fieldValue + sign)) {
      this.fieldValue += sign;
      this.fieldValueChange.emit(this.fieldValue);
      this.scrollTimeout = setTimeout(() => this.scrollLoop(sign), this.scrollRepeatInteveral);
    }
  }

  private validate(val: any) {
    const errors = this.field.validators ? this.field.validators.map(v => v(val)).filter(m => !!m) : [];
    return errors.length == 0;    
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
