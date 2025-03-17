import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

import { prismaClient } from "@repo/db/client";

// import {} from "@repo/db"

const wss = new WebSocketServer({port: 8080});

interface User{
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const users:User[] = []

//Explain checkUser function?
const checkUser = (token:string):(string|null)=>{
    const decoded = jwt.verify(token, JWT_SECRET);

    if(typeof decoded == "string"){
        return null;
    }
    if (!decoded || !decoded.userId) {
        return null;
    }

    return decoded.userId;
}

wss.on("connection",(ws, req)=>{

    //now we are going to get token from http server so that we can check if user is valid or not
    const url = req.url;
    if(!url) return;

    const queryParam = new URLSearchParams(url.split('?')[1]);
    const token = queryParam.get('token') || "";
    const userId = checkUser(token);//userId yahan se milgyi


    //jo tu na mila mujhe, to chod denge tujhe
    if(!userId){
        ws.close();
        return;
    }

    //Now it means user has connected, we will push user to empty websocket room
    //why dispatchEvent error on ws?
    users.push({
        ws,
        userId,
        rooms: [],
    })

    ws.on("message",async(data)=>{
        const parsedData = JSON.parse(data as unknown as string);

        //check if parsedData is not undefined
        if(parsedData === undefined){
            console.log(parsedData);
            return;
        }

        console.log(parsedData)

        //now if req to join a room, then add that room in users roomId
        if(parsedData.type === "join_room"){            //{"type":"", roomId}
            const roomId = parsedData.roomId;

            //find user with userId
            const user = users.find(x=>x.userId === userId);
            console.log(user)
            user?.rooms.push(roomId);
        }

        //now if req is to leave the room, then filter out that roomId
        if(parsedData.type === "leave_room"){ 
            //filter out user rooms without this roomId
            const user = users.find(x=>x.userId === userId); //finding single user with joined userId or ws
            if(!user){
                return;
            }
            
            user.rooms = user?.rooms.filter(x=>x != parsedData.roomId); //roomId removeid
        }

        //when we receive a message
        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            //push data to db and then broadcast message
            await prismaClient.chat.create({
                data:{
                    roomId: Number(roomId),
                    message,
                    userId
                }
            })

            //broadcast message to all users who have respective roomId(broadcast an object that will further be parsed into string on frontend based on the typeOfMessage inidcated by field: type)
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
        }
    })

})