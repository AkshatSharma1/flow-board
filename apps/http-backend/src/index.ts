import express, { NextFunction, Request, Response, urlencoded } from "express";

import { authMiddleware } from "./middlewares/AuthMiddleware";
import { errorHandler } from "./middlewares/ErrorHandler";
import { signUp, signIn } from "./controllers/userController";
import { getRoomBySlug, createRoom } from "./controllers/roomController";
import { getMessages } from "./controllers/chatController"

//error Handler Middleware

// Auth Middleware

//User Controller (Later make separate folders)

// Chat controller functions

// Initialize app
const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//   app.use(rateLimiter());

// Routes
app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

// Protected routes
app.post("/room", authMiddleware, createRoom);
app.get("/room/:slug", getRoomBySlug);
app.get("/chats/:roomId", getMessages);

// Error handling - must be last
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`HTTP server listening on port: ${port}`);
});
