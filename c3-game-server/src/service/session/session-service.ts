import { Injectable, Logger } from "@nestjs/common";
import { shuffle } from "@shared/util/random";
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
  
  private randomNames = shuffle(['Alligator','Anteater','Antelope','Ape','Armadillo','Donkey','Baboon','Badger','Barracuda','Bat','Bear','Beaver','Bee','Bison','Bluebird','Boar','Buffalo','Butterfly','Camel','Cassowary','Cat','Caterpillar','Cheetah','Chicken','Chimpanzee','Chinchilla','Cobra','Coyote','Crab','Cricket','Crocodile','Crow','Deer','Dog','Dolphin','Donkey','Dragonfly','Duck','Eagle','Eel','Elephant','Falcon','Flamingo','Fox','Frog','Gazelle','Gecko','Giraffe','Goat','Goose','Gorilla','Grasshopper','Hamster','Hawk','Hedgehog','Hippopotamus','Horse','Hyena','Iguana','Jaguar','Jellyfish','Kangaroo','Koala','Komodo','Leopard','Lion','Lizard','Mammoth','Meerkat','Mole','Mongoose','Mouse','Ocelot','Octopus','Orangutan','Ostrich','Otter','Ox','Owl','Oyster','Panther','Parrot','Panda','Penguin','Rabbit','Raccoon','Reindeer','Rhinoceros','Salamander','Seahorse','Seal','Shark','Snake','Spider','Squirrel','Swan','Tiger','Weasel','Wolf','Zebra']);

  /**
   * Creates a new session data for the connected client.
   */
  createSession(socket: Socket): Session {
    // TODO: get userId & username via jwt?
    const userId = this.nextDummyUserId++;
    const username = `${this.randomNames[this.nextDummyUserId % this.randomNames.length]} #${userId}`;
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
