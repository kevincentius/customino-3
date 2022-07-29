import { Injectable } from '@angular/core';
import { InputKey } from '@shared/game/network/model/input-key';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { IdbService } from 'app/service/idb.service';
import { ControlSettings } from 'app/service/user-settings/control-settings';
import { LocalSettings } from 'app/service/user-settings/local-settings';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  localSettings!: LocalSettings;

  settingsChangedSubject = new Subject<LocalSettings>();

  private onLoadCallbacks: (() => void)[] = [];

  constructor(
    private idbService: IdbService,
  ) {
    this.init();
  }

  async init() {
    const localSettings = await this.idbService.getLocalSettings();
    if (localSettings) {
      this.localSettings = localSettings;

      if (this.localSettings.control.arr == null) { this.localSettings.control.arr = 15; }
      if (this.localSettings.control.das == null) { this.localSettings.control.das = 100; }
      if (this.localSettings.control.sdr == null) { this.localSettings.control.sdr = 1; }
      if (this.localSettings.musicVolume == null) { this.localSettings.musicVolume = 1; }
      if (this.localSettings.soundVolume == null) { this.localSettings.soundVolume = 1; }

      musicService.setUserMusicVolume(this.localSettings.musicVolume);
      soundService.setUserSoundVolume(this.localSettings.soundVolume);
    } else {
      this.localSettings = this.createDefaultSettings();
      this.save();
    }

    this.onLoadCallbacks.forEach(c => c());
    this.onLoadCallbacks = [];
    this.settingsChangedSubject.next(this.localSettings);
  }

  async save() {
    this.idbService.setLocalSettings(this.localSettings);
    this.settingsChangedSubject.next(this.localSettings);
  }

  private createDefaultSettings(): LocalSettings {
    return {
      control: this.createDefaultControlSettings(),
      musicVolume: 1,
      soundVolume: 1,
    }
  }
  
  private createDefaultControlSettings(): ControlSettings {
    const keyMap = new Map<InputKey, string[]>();
    for (const inputKeyData of inputKeyDataArray) {
      if (inputKeyData.inputKey != null) {
        keyMap.set(inputKeyData.inputKey, [inputKeyData.default]);
      }
    }

    return {
      keyMap,
      arr: 15,
      das: 100,
      sdr: 1,
    }
  }

  onLoad(callback: () => void) {
    if (this.localSettings) {
      callback();
    } else {
      this.onLoadCallbacks.push(callback);
    }
  }
}
