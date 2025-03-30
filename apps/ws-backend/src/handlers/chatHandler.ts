import { prismaClient } from "@repo/db/client";
import { User, WebSocketMessage } from "../types";
import { broadcastToRoom } from "../utils/broadcastMessage";

export const handleChat = async (
  user: User,
  roomId: string,
  message: string
) => {
  try {
    //Validate if valid roomId found
    const numericRoomId = Number(roomId);
    if (isNaN(numericRoomId)) {
      throw new Error("Invalid room ID");
    }

    //Check if user joined the room or not
    if (!user.rooms.has(roomId)) {
      throw new Error("You are not in this room");
    }

    //proceed and save message to db
    const chatMessage = await prismaClient.chat.create({
      data: {
        roomId: numericRoomId,
        message: message,
        userId: user.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedMessage = {
      type: "chat",
      id: chatMessage.id,
      message: chatMessage.message,
      timestamp: new Date().toISOString(),
      user: {
        id: chatMessage.user.id,
        name: chatMessage.user.name,
        email: chatMessage.user.email,
      },
    };

    broadcastToRoom(roomId, JSON.stringify(formattedMessage));

  } catch (error) {
    console.error("Chat handling error: ", error);
    user.ws.send(
      JSON.stringify({
        type: "error",
        message: "Error sending message",
      })
    );

    throw error;
  }
};

export const handleGetHistory = async (user: User, roomId: string)=>{
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: Number(roomId)
        },
        orderBy:{id: "desc"},
        take: 50,
    });

    user.ws.send(JSON.stringify({
        type: "history",
        messages
    }))
}
