import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export const authMiddleware = (token: string): string | null =>{
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {userId: string}
        return decoded.userId
    } catch (error) {
        return null;
    }
}