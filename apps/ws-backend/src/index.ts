import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import { authMiddleware } from "./middlewares/authMiddleware";

import { User, WebSocketMessage } from "./types";
import { validateMessage } from "./utils/validators";
import { handleJoinRoom, handleLeaveRoom } from "./handlers/roomHandler";
import { handleChat, handleGetHistory } from "./handlers/chatHandler";


const wss = new WebSocketServer({port: 8080});
const users = new Map<string, User>();


wss.on("connection",(ws, req)=>{

    //now we are going to get token from http server so that we can check if user is valid or not
    /* Less secured - way
    const url = req.url;
    if(!url) return;
    
    const queryParam = new URLSearchParams(url.split('?')[1]);
    const token = queryParam.get('token') || "";
    const userId = checkUser(token);//userId yahan se milgyi
    */
    
    //get token from headers(added security)
    const token = req.headers['sec-websocket-protocol']?.toString() || "";
    const userId = authMiddleware(token);

    if(!userId){
        ws.close(4401, "Unauthorized");
        return;
    }

    //Initialize users array
    const user: User = {ws, userId, rooms: new Set()}
    users.set(userId, user);
    console.log(users)

    ws.on("message",async(data)=>{
        try {
            //Validate the input data received
            const parsedData: WebSocketMessage = JSON.parse(data.toString());
            console.log(parsedData)
            // if(!validateMessage(parsedData)){
            //     throw new Error("Invalid Message format")
            // }

            //Route messages
            switch (parsedData.type) {
                case "join_room":
                    handleJoinRoom(user, parsedData.roomId)
                    break;
                case "leave_room":
                    handleLeaveRoom(user, parsedData.roomId)
                    break;
                case "chat":
                    await handleChat(user, parsedData.roomId, parsedData.message);
                    break;
                // case "typing":
                case "get_history":
                    await handleGetHistory(user, parsedData.roomId);    
                    break;
            }

            console.log(users)
        } catch (error: any) {
            console.log("Error present");
            ws.send(JSON.stringify({type: "error", message: error.message}));
        }
    });


})