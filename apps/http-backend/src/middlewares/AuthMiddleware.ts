import { NextFunction, Request, RequestHandler, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"] ?? "";;

    if (!token) {
      res
        .status(401)
        .json({ error: "Unauthorized", message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid token" });
      return;
    }
    next(error);
  }
};