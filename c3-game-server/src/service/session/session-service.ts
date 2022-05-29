import { Injectable, Logger } from "@nestjs/common";
import EventEmitter from "events";
import { Session } from "service/session/session";
import { Socket } from "socket.io";

export enum SessionServiceEvent {
  SESSION_DESTROYED = 'destroy'
}

@Injectable()
export class SessionService {
  eventEmitter = new EventEmitter();

  private socketToSessionMap = new Map<Socket, Session>();

  private nextSessionId = 1;

  private nextDummyUserId = 1; // TODO: No longer needed when replaced with the real user id later.

  private logger: Logger = new Logger(SessionService.name);

  /**
   * Creates a new session data for the connected client.
   */
  createSession(socket: Socket): Session {
    // TODO: get userId & username via jwt?
    const userId = this.nextDummyUserId++;
    const username = 'Mock user ' + userId;
    const session = new Session(socket, this.nextSessionId++, userId, username);

    this.socketToSessionMap.set(socket, session);

    return session;
  }
  
  /**
   * Removes the session data. This must be called when a client is disconnected to free up memory.
   */
  destroySession(socket: Socket): void {
    const session = this.getSession(socket);

    this.eventEmitter.emit(SessionServiceEvent.SESSION_DESTROYED, session);

    this.socketToSessionMap.delete(socket);
  }
  
  getSession(socket: Socket): Session {
    return this.socketToSessionMap.get(socket)!;
  }
}
