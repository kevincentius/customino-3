import { Component, HostListener, Input, OnInit, Output } from '@angular/core';
import { InputKey } from '@shared/game/network/model/input-key';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';

export interface ControlRowModel {
  inputKey: InputKey;
  mappings: string[];
}

@Component({
  selector: 'app-control-row',
  templateUrl: './control-row.component.html',
  styleUrls: ['./control-row.component.scss']
})
export class ControlRowComponent implements OnInit {
  @Input() data!: ControlRowModel;
  @Input() editMode = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  getControlName() {
    return inputKeyDataArray.find(d => d.inputKey == this.data.inputKey)!.name;
  }
  
  remove(index: number) {
    this.data.mappings.splice(index, 1);
  }
}
