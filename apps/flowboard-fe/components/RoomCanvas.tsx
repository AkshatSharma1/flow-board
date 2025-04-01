"use client"

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId: string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);

    //get user token from local storage
    const storedToken = localStorage.getItem('token')

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${storedToken}`);

        ws.onopen = ()=>{
            setSocket(ws);
            
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    },[])

    if(!socket){
        return <div>Connecting to server...</div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>

}