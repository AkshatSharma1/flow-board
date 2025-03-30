// WebSocket message types
import { WebSocket } from "ws";
export type WebSocketMessage = 
  { "type": "join_room"; "roomId": string } |
  { "type": "leave_room"; "roomId": string } |
  { "type": "chat"; "roomId": string; message: string } |
  { "type": "typing"; "roomId": string; isTyping: boolean } |
//   | { type: "reaction"; roomId: string; messageId: number; emoji: string }
  { "type": "get_history"; "roomId": string };

// User and room interfaces
export interface User {
  ws: WebSocket;
  userId: string;
  rooms: Set<string>; // Use Set for faster lookups
}

export const rooms = new Map<string, Set<User>>(); // RoomID → Connected Users