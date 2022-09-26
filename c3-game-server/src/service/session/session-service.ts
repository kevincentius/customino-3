import { Injectable, Logger } from "@nestjs/common";
import { shuffle } from "@shared/util/random";
import { AuthService } from "auth/auth.service";
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
  private idToSessionMap = new Map<number, Session>();

  private nextSessionId = 1;

  private nextDummyUserId = 1; // TODO: No longer needed when replaced with the real user id later.

  private logger: Logger = new Logger(SessionService.name);
  
  private activeGuestNames = new Set<string>();

  constructor(
    private authService: AuthService,
  ) {}

  registerGuest(socket: Socket, username: string) {
    const session = this.getSession(socket);
    if (session.userId != null) { throw new Error('You must log out before logging in as a guest!'); }

    if (session.username != null) {
      this.activeGuestNames.delete(session.username);
    }

    let nextPrefix = 2;
    let attemptUsername = username;
    while (this.activeGuestNames.has(attemptUsername)) {
      attemptUsername = username + ' #' + nextPrefix;
    }

    this.activeGuestNames.add(attemptUsername);
    return attemptUsername;
  }

  /**
   * Creates a new session data for the connected client.
   */
  async createSession(socket: Socket): Promise<Session> {
    let session: Session;
    const jwtToken = socket.handshake.query.jwtToken as string;
    if (jwtToken && jwtToken != 'undefined') {
      const jwtTokenData: any = await this.authService.parseJwtToken(socket.handshake.query.jwtToken as string)
      session = new Session(socket, this.nextSessionId++, jwtTokenData.sub, jwtTokenData.username);
    } else {
      session = new Session(socket, this.nextSessionId++, null, socket.handshake.query.guestName + ' #' + this.nextDummyUserId++);
    }
    
    this.socketToSessionMap.set(socket, session);
    this.idToSessionMap.set(session.sessionId, session);

    return session;
  }
  
  /**
   * Removes the session data. This must be called when a client is disconnected to free up memory.
   */
  destroySession(socket: Socket): void {
    const session = this.getSession(socket);

    this.eventEmitter.emit(SessionServiceEvent.SESSION_DESTROYED, session);

    this.socketToSessionMap.delete(socket);
    this.idToSessionMap.delete(session.sessionId);

    // unregister guest
    if (session.userId == null && session.username != null) {
      this.activeGuestNames.delete(session.username);
    }
  }
  
  getSession(socket: Socket): Session {
    return this.socketToSessionMap.get(socket)!;
  }

  getSessionById(sessionId: number): Session {
    return this.idToSessionMap.get(sessionId)!;
  }
}
