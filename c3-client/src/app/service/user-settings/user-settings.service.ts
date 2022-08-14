import { Injectable } from '@angular/core';
import { getDefaultLocalRule } from '@shared/game/engine/model/rule/local-rule/local-rule';
import { InputKey } from '@shared/game/network/model/input-key';
import { AppService } from 'app/game-server/app.service';
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
  settingsChangedSubject = new Subject<LocalSettings>();

  private onLoadCallbacks: (() => void)[] = [];

  constructor(
    private idbService: IdbService,
    private appService: AppService,
  ) {
    this.init();
  }

  async init() {
    const saved = await this.idbService.getLocalSettings();
    if (saved) {
      localSettings = saved;

      if (localSettings.control.arr == null) { localSettings.control.arr = 15; }
      if (localSettings.control.das == null) { localSettings.control.das = 100; }
      if (localSettings.control.sdr == null) { localSettings.control.sdr = 1; }
      if (localSettings.musicVolume == null) { localSettings.musicVolume = 1; }
      if (localSettings.soundVolume == null) { localSettings.soundVolume = 1; }
      if (localSettings.localRule == null) { localSettings.localRule = getDefaultLocalRule(); }

      musicService.setUserMusicVolume(localSettings.musicVolume);
      soundService.setUserSoundVolume(localSettings.soundVolume);
    } else {
      localSettings = this.createDefaultSettings();
      this.save();
    }

    this.onLoadCallbacks.forEach(c => c());
    this.onLoadCallbacks = [];
    this.settingsChangedSubject.next(localSettings);
    this.appService.updateLocalRule(localSettings.localRule);
  }

  async save() {
    this.idbService.setLocalSettings(localSettings);
    this.settingsChangedSubject.next(localSettings);
    this.appService.updateLocalRule(localSettings.localRule);
  }

  private createDefaultSettings(): LocalSettings {
    return {
      control: this.createDefaultControlSettings(),
      musicVolume: 1,
      soundVolume: 1,
      localRule: getDefaultLocalRule(),
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
    if (localSettings) {
      callback();
    } else {
      this.onLoadCallbacks.push(callback);
    }
  }
}

let localSettings!: LocalSettings;

export function getLocalSettings() {
  return localSettings;
}
