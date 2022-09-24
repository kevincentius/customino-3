import { Injectable, NgZone } from '@angular/core';
import { localRuleFields } from '@shared/game/engine/model/rule/local-rule/local-rule-fields';
import { fillDefaultRules } from '@shared/game/engine/model/rule/player-rule';
import { userRuleFields } from '@shared/game/engine/model/rule/user-rule/user-rule-fields';
import { InputKey } from '@shared/game/network/model/input-key';
import { SystemKey } from '@shared/game/network/model/system-key';
import { GameAppService } from 'app/game-server/app.service';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { IdbService } from 'app/service/idb.service';
import { ControlSettings } from 'app/service/user-settings/control-settings';
import { LocalSettings } from 'app/service/user-settings/local-settings';
import { inputKeyDataArray } from 'app/view/menu/controls/input-key-data';
import { systemKeyDataArray } from 'app/view/menu/controls/system-key-data';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  settingsChangedSubject = new Subject<LocalSettings>();

  private onLoadCallbacks: (() => void)[] = [];

  constructor(
    private idbService: IdbService,
    private appService: GameAppService,
    private ngZone: NgZone,
  ) {}

  async init() {
    const saved = await this.idbService.getLocalSettings();
    if (saved) {
      localSettings = saved;

      if (localSettings.control.keyMap == null) { localSettings.control.keyMap = this.createDefaultInputKeyMap(); }
      inputKeyDataArray.forEach(data => {
        if (!localSettings.control.keyMap.has(data.inputKey)) {
          localSettings.control.keyMap.set(data.inputKey, [data.default]);
        }
      });

      if (localSettings.control.systemKeyMap == null) { localSettings.control.systemKeyMap = this.createDefaultSystemKeyMap(); }
      systemKeyDataArray.forEach(data => {
        if (!localSettings.control.systemKeyMap.has(data.systemKey)) {
          localSettings.control.systemKeyMap.set(data.systemKey, [data.default]);
        }
      });

      if (localSettings.control.arr == null) { localSettings.control.arr = 15; }
      if (localSettings.control.das == null) { localSettings.control.das = 100; }
      if (localSettings.control.sdr == null) { localSettings.control.sdr = 15; }
      if (localSettings.musicVolume == null) { localSettings.musicVolume = 1; }
      if (localSettings.soundVolume == null) { localSettings.soundVolume = 1; }
      
      if (localSettings.userRule == null) { localSettings.userRule = {} as any; }
      fillDefaultRules(localSettings.userRule, userRuleFields);
      
      if (localSettings.localRule == null) { localSettings.localRule = {} as any; }
      fillDefaultRules(localSettings.localRule, localRuleFields);
      
      musicService.setUserMusicVolume(localSettings.musicVolume, this.ngZone);
      soundService.setUserSoundVolume(localSettings.soundVolume);
    } else {
      localSettings = this.createDefaultSettings();
      this.save();
    }

    this.onLoadCallbacks.forEach(c => c());
    this.onLoadCallbacks = [];
    this.settingsChangedSubject.next(localSettings);
    this.appService.updateUserRule(localSettings.userRule);
  }

  async save() {
    this.idbService.setLocalSettings(localSettings);
    this.settingsChangedSubject.next(localSettings);
    this.appService.updateUserRule(localSettings.userRule);
  }

  private createDefaultSettings(): LocalSettings {
    const settings = {
      control: this.createDefaultControlSettings(),
      musicVolume: 1,
      soundVolume: 1,
      userRule: {},
      localRule: {},
    } as LocalSettings;

    fillDefaultRules(settings.userRule, userRuleFields);
    fillDefaultRules(settings.localRule, localRuleFields);
    return settings;
    
  }

  private createDefaultControlSettings(): ControlSettings {
    return {
      keyMap: this.createDefaultInputKeyMap(),
      systemKeyMap: this.createDefaultSystemKeyMap(),
      arr: 15,
      das: 100,
      sdr: 10,
    }
  }

  private createDefaultInputKeyMap() {
    const keyMap = new Map<InputKey, string[]>();
    for (const inputKeyData of inputKeyDataArray) {
      keyMap.set(inputKeyData.inputKey, [inputKeyData.default]);
    }
    return keyMap;
  }

  private createDefaultSystemKeyMap() {
    const systemKeyMap = new Map<SystemKey, string[]>();
    for (const systemKeyData of systemKeyDataArray) {
      systemKeyMap.set(systemKeyData.systemKey, [systemKeyData.default]);
    }
    return systemKeyMap;
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

export function isSystemKey(ev: KeyboardEvent, systemKey: SystemKey) {
  return localSettings.control.systemKeyMap.get(systemKey)![0] == ev.code;
}