import { WS_URL } from "../app/config";
import { useState, useEffect } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);

    //on mount
    useEffect(()=>{
        //on mouting setup a websocket server
        const ws = new WebSocket(WS_URL,["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNzczZGE1MC05MzFhLTQ4YzMtOTNmYy04YTQwNTVmYjZiNmEiLCJpYXQiOjE3NDIzMjI1OTIsImV4cCI6MTc0MjkyNzM5Mn0.1oKs0b-tCeLD59_lGweU4DYqCJosdAjSliwB3xi_sFk"]);
        ws.onopen = ()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return{
        socket,
        loading
    }
}