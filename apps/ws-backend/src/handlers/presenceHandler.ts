import { rooms } from "../types"

export const broadcastPresence  = (roomId: string)=>{
    const roomUsers = rooms.get(roomId);
    if(!roomUsers) return;

    const userIds = Array.from(roomUsers).map((user)=>user.userId);
    const presenceMessage = JSON.stringify({
        type: "presence",
        userIds
    });

    roomUsers.forEach(user=>{
        user.ws.send(presenceMessage);
    })
}