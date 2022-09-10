import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  private registeredCallbacks: { event: string, callback: (...args: any[]) => void }[] = [];

  private connected = false;
  private connectCallbacks: (() => any)[] = [];

  waitUntilConnected(): Promise<void> {
    return new Promise(resolve => {
      if (this.connected) {
        resolve();
      } else {
        this.connectCallbacks.push(() => resolve());
      }
    });
  }

  async connect(gameServerUrl: string): Promise<void> {
    if (this.socket) {
      throw new Error('Already connected!');
    }

    return new Promise(resolve => {
      this.socket = io(gameServerUrl, { withCredentials: true });
      this.socket.on('connect', () => {
        resolve();
      });

      for (let registeredCallback of this.registeredCallbacks) {
        this.socket.on(registeredCallback.event, registeredCallback.callback);
      }
    })
  }

  emit(event: string, ...args: any[]): void {
    if (!this.socket) {
      throw new Error('Cannot emit event while not connected!');
    }

    this.socket.emit(event, ...args);
  }

  async emitQuery(event: string, ...args: any[]): Promise<any> {
    return new Promise((resolve) => {
      if (!this.socket) {
        console.error('Cannot emit event while not connected!');
        resolve(undefined);
      }
      
      this.socket.emit(event, ...args, (response: any) => resolve(response));
    });
  }
  
  on(event: string, callback: (...args: any[]) => void) {
    this.registeredCallbacks.push({ event, callback });
  }
}
