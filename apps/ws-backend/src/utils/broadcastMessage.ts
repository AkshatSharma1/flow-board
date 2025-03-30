import WebSocket from "ws";
import { rooms } from "../types"

export const broadcastToRoom = (roomId: string, message: string)=>{
    const roomUsers = rooms.get(roomId);

    //if no users exists, then just return
    if(!roomUsers) return;

    //else broadcast to all room members
    roomUsers.forEach((user)=>{
        if(user.ws.readyState == WebSocket.OPEN){
            user.ws.send(message);
        }
    });
}