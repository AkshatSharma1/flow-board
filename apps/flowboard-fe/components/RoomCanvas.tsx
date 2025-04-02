"use client"

import { WS_URL } from "@/config";
import { useEffect, useReducer, useRef, useState } from "react";
import { Canvas } from "./Canvas";

const RECONNECT_DELAY = 3000;

export function RoomCanvas({roomId}:{roomId: string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    //get user token from local storage
    const storedToken = localStorage.getItem('token')

    const connectWebSocket = () => {
        const ws = new WebSocket(`${WS_URL}?token=${storedToken}`);

        ws.onopen = ()=>{
            console.log('Connected to the WebSocket server.');
            reconnectAttempts.current = 0;
            setSocket(ws);

            ws.send(JSON.stringify({
                type: 'join_room',
                roomId
            }))
        };

        ws.onclose = (e) => {
            console.log('Disconnected from the WebSocket server.', e.reason);
            if (reconnectAttempts.current < 5) {
                setTimeout(() => {
                    reconnectAttempts.current++;
                    connectWebSocket();
                }, RECONNECT_DELAY * reconnectAttempts.current);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            ws.close();
        };

        return ws;
    }

    useEffect(() => {
        const ws = connectWebSocket();
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close(1000, "Component unmounted");
            }
        };

    },[])

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        return <div className="p-4 text-center">
            {reconnectAttempts.current > 0
                ? `Reconnecting... (Attempt ${reconnectAttempts.current})`
                : "Connecting to drawing session..."
            }
        </div>;
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>

}