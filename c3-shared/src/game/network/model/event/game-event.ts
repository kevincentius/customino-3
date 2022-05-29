
export enum GameEventType {
  INPUT,
}

/**
 * Describes the event of a key being pressed or released.
 * For most purposes, the frame number will be used rather than the timestamp.
 * The timestamp is recorded in addition in case we want a more accurate replay.
 * 
 * The event must be executed **BEFORE** the update loop for the specified frame number.
 */
export interface GameEvent {
  frame: number;
  timestamp: number;
  type: GameEventType;
}
