// Show chats from particular room

import axios from "axios";
import {BACKEND_URL} from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string){
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    console.log(response.data)

    return response.data.room.id;
}

export default async function roomDetails({params}:{
    params:{
        slug: string
    }
}){
    const slug = params.slug;
    const roomId = await getRoomId(slug);

    return <ChatRoom id={roomId} />
}