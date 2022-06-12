import { Component, HostListener } from '@angular/core';
import { InputKey } from '@shared/game/network/model/input-key';
import { IdbService } from 'app/service/idb.service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { ControlRowModel } from 'app/view/menu/controls/control-row/control-row.component';
import { ControlSettings } from 'app/view/menu/controls/control-settings';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  controlSettings!: ControlSettings;

  // view model
  rows: ControlRowModel[] = inputKeyDataArray
    .filter(d => d.inputKey != null)
    .map(d => ({ inputKey: d.inputKey!, mappings: [] }));

  editIndex: number | null = null;

  constructor(
    private mainService: MainService,
    private idbService: IdbService,
  ) { }

  async load() {
    this.controlSettings = await this.idbService.getControlSettings() ?? this.createDefaultSettings();
    this.rows.forEach(row => row.mappings = this.controlSettings.keyMap.get(row.inputKey)!);
  }

  private createDefaultSettings(): ControlSettings {
    const keyMap = new Map<InputKey, string[]>();
    for (const inputKeyData of inputKeyDataArray) {
      if (inputKeyData.inputKey != null) {
        keyMap.set(inputKeyData.inputKey, [inputKeyData.default]);
      }
    }

    return {
      keyMap,
    }
  }

  onBackClick() {
    this.editIndex = null;
    this.mainService.openScreen(MainScreen.MENU);
  }
  
  onRowClick(index: number) {
    this.editIndex = this.editIndex == index ? null : index;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (this.editIndex != null) {
      const inputKey = this.rows[this.editIndex].inputKey;
      this.controlSettings.keyMap.set(inputKey, [event.code]);
      this.rows[this.editIndex].mappings = this.controlSettings.keyMap.get(inputKey)!;
      this.idbService.setControlSettings(this.controlSettings);
      this.editIndex++;

      if (this.editIndex >= this.rows.length) {
        this.editIndex = null;
      }
    }
  }
}
