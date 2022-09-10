import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputKey } from '@shared/game/network/model/input-key';
import { SystemKey } from '@shared/game/network/model/system-key';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';

export interface ControlRowModel {
  inputKey: InputKey | SystemKey;
  mappings: string[];
  name: string;
}

@Component({
  selector: 'app-control-row',
  templateUrl: './control-row.component.html',
  styleUrls: ['./control-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlRowComponent {
  @Input() data?: ControlRowModel;
  @Input() editMode = false;
  @Input() value?: number;

  @Input() name?: string;
  @Output() inputBlur = new EventEmitter<number>();
  
  getControlName() {
    return this.name ?? this.data?.name ?? '?';
  }

  onInputBlur() {
    this.inputBlur.emit(this.value);
  }
}
