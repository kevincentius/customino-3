import { Injectable } from '@angular/core';
import { ControlSettings } from 'app/view/menu/controls/control-settings';

@Injectable({
  providedIn: 'root'
})
export class IdbService {

  static DB_NAME = 'vkg';

  private db: any;

  private resetEverytime = false;

  asyncInit(callback: any) {
    let request = window.indexedDB.open(IdbService.DB_NAME, 1);
    request.onupgradeneeded = function (e) {
      let db = (e.target as any).result;
      db.createObjectStore(IdbService.DB_NAME, { keyPath: 'key' });
    }
    request.onsuccess = (e: any) => {
      this.db = (e.target as any).result;
      if (this.resetEverytime) {
        console.log('RESETTING IDB');
        this.clear();
      }
      callback();
    }
  }

  private clear() {
    // reset idb
    this.db.transaction([IdbService.DB_NAME], "readwrite")
      .objectStore(IdbService.DB_NAME)
      .clear();
  }

  private get(key: string, defaultValue: any = null): Promise<any> {
    return new Promise(resolve => {
      let request = this.db.transaction([IdbService.DB_NAME])
        .objectStore(IdbService.DB_NAME)
        .get(key);
      request.onerror = function (event: any) {
        console.error('Failed to load ' + key);
        console.error(event);
        resolve(null);
      }
      request.onsuccess = function () {
        let data = request.result == null ? defaultValue : request.result.value;
        resolve(data);
      }
    });
  }

  private set(key: string, value: any, onsuccess = () => { }) {
    let transaction = this.db.transaction([IdbService.DB_NAME], "readwrite");
    let request = transaction.objectStore(IdbService.DB_NAME).put({ key: key, value: value });
    request.onerror = function (event: any) {
      console.log('Failed to save ' + key);
      console.log(event);
    }
    transaction.oncomplete = function () {
      onsuccess();
    };
  }

  async getControlSettings(): Promise<ControlSettings | undefined> {
    return this.get('control-settings');
  }

  setControlSettings(controlSettings: ControlSettings) {
    this.set('control-settings', controlSettings);
  }
}
