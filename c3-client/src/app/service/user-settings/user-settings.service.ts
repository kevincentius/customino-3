import { Injectable, OnInit } from '@angular/core';
import { InputKey } from '@shared/game/network/model/input-key';
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
      arr: 100,
      das: 250,
      sdr: 100,
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
