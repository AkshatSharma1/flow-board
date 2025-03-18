import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SignInSchema } from "@repo/db-common/types";
import { prismaClient } from "@repo/db/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    if (!data.success) {
      res.status(400).json({
        message: "Invalid Input format",
        errors: data.error.issues,
      });
      return;
    }

    //check if user already in db
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.data.email,
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    //add user to db but hash password before
    const hashedPassword = await bcrypt.hash(data.data.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: data.data.username,
        email: data.data?.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      userId: user.id,
      message: "User created successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = SignInSchema.safeParse(req.body);

    if (!data.success) {
      res.status(400).json({
        message: "Invalid input format",
        errors: data.error.issues,
      });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { email: data.data.email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(
      data.data.password,
      user.password
    );

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Use HTTP-only cookie for better security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const userController = {
  signUp,
  signIn,
};
