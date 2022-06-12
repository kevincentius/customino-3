import { Injectable } from '@angular/core';
import { LocalSettings } from 'app/service/user-settings/local-settings';

@Injectable({
  providedIn: 'root'
})
export class IdbService {

  static DB_NAME = 'vkg';

  private db: any;

  private resetEverytime = false;

  private onLoadCallbacks: (() => void)[] = [];
  private loaded = false;

  constructor() {
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

      this.loaded = true;
      this.onLoadCallbacks.forEach(c => c());
      this.onLoadCallbacks = [];
    }
  }
  
  async waitForInit(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve();
    } else {
      return new Promise(resolve => this.onLoadCallbacks.push(resolve));
    }
  }

  private clear() {
    // reset idb
    this.db.transaction([IdbService.DB_NAME], "readwrite")
      .objectStore(IdbService.DB_NAME)
      .clear();
  }

  private async get(key: string, defaultValue: any = null): Promise<any> {
    await this.waitForInit();
    
    let request = this.db.transaction([IdbService.DB_NAME])
      .objectStore(IdbService.DB_NAME)
      .get(key);
    request.onerror = function (event: any) {
      console.error('Failed to load ' + key);
      console.error(event);
      return null;
    }
    return new Promise<any>(resolve => {
      request.onsuccess = function () {
        resolve(request.result == null ? defaultValue : request.result.value);
      }
    });
  }

  private async set(key: string, value: any) {
    await this.waitForInit();

    let transaction = this.db.transaction([IdbService.DB_NAME], "readwrite");
    let request = transaction.objectStore(IdbService.DB_NAME).put({ key: key, value: value });
    request.onerror = function (event: any) {
      console.log('Failed to save ' + key);
      console.log(event);
    }

    return new Promise<void>(resolve => {
      transaction.oncomplete = function () {
        resolve();
      };
    })
  }

  async getLocalSettings(): Promise<LocalSettings | undefined> {
    return this.get('local-settings');
  }

  async setLocalSettings(localSettings: LocalSettings) {
    return this.set('local-settings', localSettings);
  }
}
