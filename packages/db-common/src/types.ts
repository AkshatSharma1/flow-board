import {z} from "zod"

//user schema
export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(50)
})

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50)
})

export const CreateRoomSchema = z.object({
    roomName: z.string().min(3).max(15)
})

export const ChatMessageSchema = z.object({
    type: z.literal("chat"),
    roomId: z.string(),
    message: z.string().min(1).max(500)
})