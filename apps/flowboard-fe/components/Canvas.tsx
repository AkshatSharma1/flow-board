import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({roomId, socket}:{
    roomId: string;
    socket: WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(()=>{
        //get canvas
        if(canvasRef.current){
            const canvas = canvasRef.current;

            initDraw(canvas, roomId, socket);
        }
        
    }, [])


    return <div>
        <canvas ref={canvasRef} id="canvas" />
    </div>
}