
/**
 * Each connected browser tab is a session.
 * 
 * It is not yet discussed if it should be allowed to have multiple sessions with the same user.
 */
export interface ClientInfo {
  id: number;

  userId: number;
  username: string;
}
