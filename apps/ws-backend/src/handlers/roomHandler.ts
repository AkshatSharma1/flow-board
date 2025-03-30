import { rooms, User } from "../types";
import { broadcastPresence } from "./presenceHandler";

export const handleJoinRoom = (user: User, roomId: string) =>{
    user.rooms.add(roomId);

    if(!rooms.has(roomId)){
        rooms.set(roomId, new Set());
    }

    //if already room is present in our pool, then add user to that room
    rooms.get(roomId)?.add(user);
    broadcastPresence(roomId);
}

export const handleLeaveRoom = (user: User, roomId: string)=>{
    user.rooms.delete(roomId);
    rooms.get(roomId)?.delete(user);
    broadcastPresence(roomId)
}

export const roomHandler = {
    handleJoinRoom,
    handleLeaveRoom
}