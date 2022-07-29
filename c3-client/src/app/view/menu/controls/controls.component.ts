import { Component, HostListener } from '@angular/core';
import { IdbService } from 'app/service/idb.service';
import { UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { ControlRowModel } from 'app/view/menu/controls/control-row/control-row.component';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';
import { LocalSettings } from 'app/service/user-settings/local-settings';
import { PlayerRuleField } from '@shared/game/engine/model/rule/field';
import { FieldType } from '@shared/game/engine/model/rule/field-type';
import { intRangeValidator } from '@shared/game/engine/model/rule/field-validators';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  soundVolumeField: PlayerRuleField = {
    property: 'soundVolume',
    default: 100,
    name: 'Sound volume',
    description: 'Controls how loud sound effects will be. Does not affect music.',
    fieldType: FieldType.NUMBER_SCROLL,
    validators: [ intRangeValidator(0, 100) ],
    stepSize: 10,
    tags: [],
  }

  musicVolumeField: PlayerRuleField = {
    property: 'musicVolume',
    default: 100,
    name: 'Music volume',
    description: 'Controls the loudness of musics. Does not affect other sound effects.',
    fieldType: FieldType.NUMBER_SCROLL,
    validators: [ intRangeValidator(0, 100) ],
    stepSize: 10,
    tags: [],
  }

  // view model
  rows: ControlRowModel[] = inputKeyDataArray
    .filter(d => d.inputKey != null)
    .map(d => ({ inputKey: d.inputKey!, mappings: [] }));

  editIndex: number | null = null;

  localSettings!: LocalSettings;

  constructor(
    private userSettingsService: UserSettingsService,
    private mainService: MainService,
    private idbService: IdbService,
  ) { }

  ngOnInit() {
    this.userSettingsService.onLoad(() => {
      this.localSettings = this.userSettingsService.localSettings;
      console.log(this.localSettings);
      this.rows.forEach(row => row.mappings = this.localSettings.control.keyMap.get(row.inputKey)!);
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
      this.localSettings.control.keyMap.set(inputKey, [event.code]);
      this.rows[this.editIndex].mappings = this.localSettings.control.keyMap.get(inputKey)!;
      this.userSettingsService.save();
      this.editIndex++;

      if (this.editIndex >= this.rows.length) {
        this.editIndex = null;
      }
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

  // value is base 1
  onSoundVolumeUpdated(value: number) {
    this.localSettings.soundVolume = value;
    soundService.setUserSoundVolume(value);
    this.userSettingsService.save();
    
  }

  // value is base 1
  onMusicVolumeUpdated(value: number) {
    this.localSettings.musicVolume = value;
    musicService.setUserMusicVolume(value);
    this.userSettingsService.save();
  }
}
