import { WS_URL } from "../app/config";
import { useState, useEffect } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);

    //on mount
    useEffect(()=>{
        //on mouting setup a websocket server
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNzczZGE1MC05MzFhLTQ4YzMtOTNmYy04YTQwNTVmYjZiNmEiLCJpYXQiOjE3NDIxNTA4Nzl9.Vr5qkUPllCA6B-F_UkrXaY_lB16qGNnjbsleQ78-Lm8`);
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