import express, { Request, Response, urlencoded } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECRET} from "@repo/backend-common/config";
import bcrypt from "bcrypt"

import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/db-common/types";
import {prismaClient} from "@repo/db/client"

const app = express();
const port = 3001;

//encoding data
app.use(express.json()) //json format se string format
app.use(express.urlencoded({extended: true})) //formdata to readbale data

//sign-up 
app.post("/sign-up",async (req: Request, res: Response)=>{
    //get data
    // const {name, email, password} = req.body;
    //here we will be fectching data by validting via zod
    const data = CreateUserSchema.safeParse(req.body);

    //check if data came or not
    if(!data.success){
        console.log(data.error)
        res.json({
            message: "Invalid input format"
        })
        return;
    }

    const hashPassword = async (password: string)=>{
        const saltedPassword = await bcrypt.hash(password, 10);
        return saltedPassword;
    }

    //process data
    try {
        const hashedPassword = await hashPassword(data.data.password)
        const user = await prismaClient.user.create({
            data:{
                name: data.data.username,
                email: data.data?.email,
                password: hashedPassword
            }
        })

        res.json({
            userId: user.id
        })
    } catch (error) {
        res.status(411).json({
            message: "Email already exists"
        })
    }
    
    //add user to db

})

//sign-in: use jwt to create and send a token
app.post("/sign-in", async(req: Request, res: Response)=>{
    //get data
    // const {email, password} = req.body;
    const data = SignInSchema.safeParse(req.body);

    //check if data came or not
    if(!data.success){
        console.log(data.error)
        res.json({
            message: "Invalid input format"
        })
        return;
    }     

    //how to compare hashedPassword?

    //process data
        const user = await prismaClient.user.findUnique({
            where: {
                email: data.data.email
            }
        })

        //null check bcoz of TS
        if(!user){
            res.json({message: "User not in db"})
            return;
        }

        //compare hashed password
        const isValid = await bcrypt.compare(data.data.password, user.password)
        
        if(!isValid){
            res.status(401).json({
                message: "Invalid password"
              })
              return;
        }
        
        //create a token and send it
        const token = jwt.sign({userId: user?.id}, JWT_SECRET);

        res.json({
            token
        })

})

app.post("/room", middleware, async (req: Request, res: Response)=>{
    const roomData = CreateRoomSchema.safeParse(req.body);
    if(!roomData.success){
        res.json({
            message: "Invalid input format"
        })
        return;
    }

    //get userId from middleware
    //@ts-ignore
    const userId = req.userId;

    //process data
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: roomData.data.roomName,
                adminId: userId
            }
        })
        
        //once created, return the id
        res.json({
            roomId: room.id
        })
    } catch (error) {
        res.status(411).json({message: "Room already exists with given name"})
    }
})

//get chats
app.get("/chats/:roomId",async (req, res)=>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });

    res.json({
        messages //returns block of messages
    })
})

//get roomId from slug
app.get("/room/:slug", async(req, res)=>{
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(port, ()=>{
    console.log("Listening at port: ", port)
})
