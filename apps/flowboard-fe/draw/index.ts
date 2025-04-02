import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    //canvas context
    const ctx = canvas.getContext("2d");

    //storing shapes
    let existingShapes: Shape[] = await getExistingShapes(roomId);

    //handle null
    if (!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes, canvas, ctx);
        }
    }

    //make bg black i.e. clear canvas
    clearCanvas(existingShapes, canvas, ctx);
    //   ctx.fillStyle = "black";
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);

    //logic to draw rectangles
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        console.log(e.clientX, " ", e.clientY);
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
        console.log(e.clientX, " ", e.clientY);
        clicked = false;

        //push shape inside existing shapes array
        const width = startX - e.clientX;
        const height = startY - e.clientY;

        let shape: Shape | null = null;
        
        shape = {
            type: "rect",
            x: startX,
            y: startY,
            height,
            width
        }

        if (!shape) {
            return;
        }

        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }))

    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            //draw now
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgb(255,255,255)";
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}

//clear canvas function - written separately
const clearCanvas = (existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    //clear the canvas and then render exisiting shapes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //render existing shapes
    if(existingShapes.length>0){
        existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                ctx.strokeStyle = "rgb(255,255,255)";
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            //do for all shapes
        })
    }

}

//get existing shapes from backend
const getExistingShapes = async (roomId: string) => {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    console.log(res)
    //render shapes
    const messages = res.data.messages || []; // Default to empty array if undefined
    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    });

    return shapes;
}