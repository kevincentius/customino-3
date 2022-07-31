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

  // NUMBER
  onInputChange() {
    this.errors = this.field.validators ? this.field.validators.map(v => v(this.inpValue)).filter(m => !!m) : [];
    
    if (this.errors.length == 0) {
      this.fieldValueChange.emit(this.getValue());
    }
  }

  // NUMBER_SCROLL
  startScroll(sign: number, index?: number) {
    const delta = sign * (this.field.stepSize ?? 1);
    if (index == undefined) {
      const newValue = this.removeEps(this.fieldValue + delta);
      if (this.validate(newValue)) {
        this.fieldValue = newValue
        this.fieldValueChange.emit(this.fieldValue);
      }
    } else {
      const newValue = [...this.fieldValue];
      newValue[index] = this.removeEps(newValue[index] + delta);
      if (this.validate(newValue)) {
        this.fieldValue[index] = newValue[index];
        this.fieldValueChange.emit(this.fieldValue);
      }
    }
    this.scrollTimeout = setTimeout(() => this.scrollLoop(sign, index), this.scrollDelay);
  }

  endScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = undefined;
    }
  }

  scrollLoop(sign: number, index?: number) {
    const delta = sign * (this.field.stepSize ?? 1);
    if (index == undefined) {
      const newValue = this.removeEps(this.fieldValue + delta);
      if (this.validate(newValue)) {
        this.fieldValue = newValue;
        this.fieldValueChange.emit(this.fieldValue);
        this.scrollTimeout = setTimeout(() => this.scrollLoop(sign, index), this.scrollRepeatInteveral);
      }
    } else {
      const newValue = [...this.fieldValue];
      newValue[index] = this.removeEps(newValue[index] + delta);
      if (this.validate(newValue)) {
        this.fieldValue[index] = newValue[index];
        this.fieldValueChange.emit(this.fieldValue);
        this.scrollTimeout = setTimeout(() => this.scrollLoop(sign, index), this.scrollRepeatInteveral);
      }
    }
  }

  private removeEps(val: number) {
    if (Math.abs(val - Math.floor(val)) < 0.0000001) {
      return Math.floor(val);
    } else {
      return val;
    }
  }

  // CHOICE
  getChoiceLabel() {
    return this.field.choices![this.getChoiceIndex()].label;
  }

  onChangeChoice(sign: number) {
    this.fieldValue = this.field.choices![((this.getChoiceIndex() + sign) % this.field.choices!.length)].value;
    this.fieldValueChange.emit(this.fieldValue);
  }

  canChangeChoice(sign: number) {
    const index = this.getChoiceIndex() + sign;
    return index >= 0 && index < this.field.choices!.length;
  }

  private getChoiceIndex() {
    return this.field.choices!.findIndex(choice => choice.value == this.fieldValue);
  }

  // NUMBER LIST


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
