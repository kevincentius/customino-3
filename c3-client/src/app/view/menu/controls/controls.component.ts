import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { getLocalSettings, UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { MainService } from 'app/view/main/main.service';
import { ControlRowModel } from 'app/view/menu/controls/control-row/control-row.component';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';
import { LocalSettings } from 'app/service/user-settings/local-settings';
import { getField, setField } from '@shared/game/engine/model/rule/data-field/data-field';
import { musicVolumeField, soundVolumeField } from 'app/view/menu/controls/settings-fields';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { DataField } from '@shared/game/engine/model/rule/data-field/data-field';
import { MainScreen } from 'app/view/main/main-screen';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  settingsFields = [
    musicVolumeField,
    soundVolumeField,
  ];

  // view model
  rows: ControlRowModel[] = inputKeyDataArray
    .filter(d => d.inputKey != null)
    .map(d => ({ inputKey: d.inputKey!, mappings: [] }));

  editIndex: number | null = null;

  hint = '';

  localSettings!: LocalSettings;

  constructor(
    private userSettingsService: UserSettingsService,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.userSettingsService.onLoad(() => {
      console.log(getLocalSettings());
      this.localSettings = getLocalSettings();
      this.rows.forEach(row => row.mappings = this.localSettings.control.keyMap.get(row.inputKey)!);
    });
  }

  onBackClick() {
    this.editIndex = null;
    this.userSettingsService.save();
    this.mainService.back();
  }
  
  onRowClick(index: number) {
    this.editIndex = this.editIndex == index ? null : index;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (this.editIndex != null) {
      const inputKey = this.rows[this.editIndex].inputKey;
      this.localSettings.control.keyMap.set(inputKey, [event.code]);
      this.rows[this.editIndex].mappings = this.localSettings.control.keyMap.get(inputKey)!;
      this.userSettingsService.save();
      this.editIndex = null;
    }
  }

  onDasUpdated(value: number) {
    this.localSettings.control.das = Math.max(10, Math.min(1000, value));
    this.userSettingsService.save();
  }
  
  onArrUpdated(value: number) {
    this.localSettings.control.arr = Math.max(0, Math.min(1000, value));
    this.userSettingsService.save();
  }
  
  onSdrUpdated(value: number) {
    this.localSettings.control.sdr = Math.max(0, Math.min(1000, value));
    this.userSettingsService.save();
  }

  getFieldValue(field: DataField) {
    return getField(this.localSettings, field);
  }

  setFieldValue(field: DataField, value: any) {
    setField(this.localSettings, field, value);

    if (field == musicVolumeField) {
      musicService.setUserMusicVolume(value / 100);
    } else if (field == soundVolumeField) {
      soundService.setUserSoundVolume(value);
    }
    this.userSettingsService.save();
  }

  onMoreClick() {
    this.mainService.openScreen(MainScreen.PERSONALIZATION);
  }
}
