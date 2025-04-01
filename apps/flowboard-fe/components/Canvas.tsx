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
        
    },[canvasRef, roomId])


    return <div>
        {/* Give full width and height */}
        <canvas ref={canvasRef} id="canvas" width="100%" height="100%"/>
    </div>
}