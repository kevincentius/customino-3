import { Component, HostListener } from '@angular/core';
import { InputKey } from '@shared/game/network/model/input-key';
import { IdbService } from 'app/service/idb.service';
import { UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { ControlRowModel } from 'app/view/menu/controls/control-row/control-row.component';
import { ControlSettings } from 'app/service/user-settings/control-settings';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  // view model
  rows: ControlRowModel[] = inputKeyDataArray
    .filter(d => d.inputKey != null)
    .map(d => ({ inputKey: d.inputKey!, mappings: [] }));

  editIndex: number | null = null;

  controlSettings!: ControlSettings;

  constructor(
    private userSettingsService: UserSettingsService,
    private mainService: MainService,
    private idbService: IdbService,
  ) { }

  ngOnInit() {
    this.userSettingsService.onLoad(() => {
      this.controlSettings = this.userSettingsService.localSettings.control;
      this.rows.forEach(row => row.mappings = this.controlSettings.keyMap.get(row.inputKey)!);
    });
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
      this.userSettingsService.save();
      this.editIndex++;

      if (this.editIndex >= this.rows.length) {
        this.editIndex = null;
      }
    }
  }

  onDasUpdated(value: number) {
    this.controlSettings.das = Math.max(10, Math.min(1000, value));
    this.userSettingsService.save();
  }
  
  onArrUpdated(value: number) {
    this.controlSettings.arr = Math.max(0, Math.min(1000, value));
    this.userSettingsService.save();
  }
  
  onSdrUpdated(value: number) {
    this.controlSettings.sdr = Math.max(0, Math.min(1000, value));
    this.userSettingsService.save();
  }
}
