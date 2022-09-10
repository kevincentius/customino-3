import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, NgZone } from '@angular/core';
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
import { InputKey } from '@shared/game/network/model/input-key';
import { systemKeyDataArray } from './system-key-data';
import { SystemKey } from '@shared/game/network/model/system-key';

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
  inputKeyRows: ControlRowModel[] = inputKeyDataArray
    .map(d => ({ inputKey: d.inputKey, mappings: [], name: d.name }));

  systemKeyRows: ControlRowModel[] = systemKeyDataArray
    .map(d => ({ inputKey: d.systemKey, mappings: [], name: d.name }));

  editInputKeyIndex: number | null = null;
  editSystemKeyIndex: number | null = null;

  hint = '';

  localSettings!: LocalSettings;

  constructor(
    private userSettingsService: UserSettingsService,
    private mainService: MainService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.userSettingsService.onLoad(() => {
      this.localSettings = getLocalSettings();
      this.inputKeyRows.forEach(row => row.mappings = this.localSettings.control.keyMap.get(row.inputKey as InputKey)!);
      this.systemKeyRows.forEach(row => row.mappings = this.localSettings.control.systemKeyMap.get(row.inputKey as SystemKey)!);
      this.cd.detectChanges();
    });
  }

  onBackClick() {
    this.editInputKeyIndex = null;
    this.userSettingsService.save();
    this.mainService.back();
    soundService.play('back');
  }
  
  onInputKeyRowClick(index: number) {
    this.editInputKeyIndex = this.editInputKeyIndex == index ? null : index;
    this.editSystemKeyIndex = null;
  }

  onSystemKeyRowClick(index: number) {
    this.editInputKeyIndex = null;
    this.editSystemKeyIndex = this.editSystemKeyIndex == index ? null : index;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (this.editInputKeyIndex != null) {
      const inputKey = this.inputKeyRows[this.editInputKeyIndex].inputKey;
      this.localSettings.control.keyMap.set(inputKey as InputKey, [event.code]);
      this.inputKeyRows[this.editInputKeyIndex].mappings = this.localSettings.control.keyMap.get(inputKey as InputKey)!;
      this.userSettingsService.save();
      this.editInputKeyIndex = null;

      event.stopPropagation();
      event.preventDefault();
    } else if (this.editSystemKeyIndex != null) {
      const systemKey = this.systemKeyRows[this.editSystemKeyIndex].inputKey;
      this.localSettings.control.systemKeyMap.set(systemKey as SystemKey, [event.code]);
      this.systemKeyRows[this.editSystemKeyIndex].mappings = this.localSettings.control.systemKeyMap.get(systemKey as SystemKey)!;
      this.userSettingsService.save();
      this.editSystemKeyIndex = null;
      
      event.stopPropagation();
      event.preventDefault();
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
      musicService.setUserMusicVolume(value / 100, this.ngZone);
    } else if (field == soundVolumeField) {
      soundService.setUserSoundVolume(value);
    }
    this.userSettingsService.save();
  }

  onMoreClick() {
    this.mainService.openScreen(MainScreen.PERSONALIZATION);
    soundService.play('button', 0, 2);
  }
}
