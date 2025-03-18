import { prismaClient } from "@repo/db/client";
import { NextFunction, Request, Response } from "express";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);

    if (isNaN(roomId)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    // Check if room exists
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
    });

    res.json({ messages });
    return;
  } catch (error) {
    next(error);
  }
};

export const chatController = {
    getMessages
}
