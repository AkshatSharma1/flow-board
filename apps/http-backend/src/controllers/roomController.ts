import { CreateRoomSchema } from "@repo/db-common/types";
import { prismaClient } from "@repo/db/client";
import { NextFunction, Request, Response } from "express";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomData = CreateRoomSchema.safeParse(req.body);

    if (!roomData.success) {
      res.status(400).json({
        message: "Invalid input format",
        errors: roomData.error.issues,
      });
      return;
    }
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Check if room already exists
    const existingRoom = await prismaClient.room.findFirst({
      where: { slug: roomData.data.roomName },
    });

    if (existingRoom) {
      res.status(409).json({ message: "Room already exists with this name" });
      return;
    }

    //if room not exists
    const room = await prismaClient.room.create({
      data: {
        slug: roomData.data.roomName,
        adminId: userId,
      },
    });

    res.status(201).json({
      roomId: room.id,
      slug: room.slug,
      message: "Room created successfully",
    });

    return;
    
  } catch (error) {
    next(error);
  }
};

export const getRoomBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({ message: "Room slug is required" });
      return;
    }

    const room = await prismaClient.room.findFirst({
      where: { slug },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    res.json({ room });
    return;
  } catch (error) {
    next(error);
  }
};

export const roomController = {
  createRoom,
  getRoomBySlug,
};
