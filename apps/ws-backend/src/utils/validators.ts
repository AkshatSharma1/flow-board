import {ChatMessageSchema} from "@repo/db-common/types";
import { WebSocketMessage } from "../types";

export const validateMessage = (data: unknown): WebSocketMessage | null =>{
    const result = ChatMessageSchema.safeParse(data);
    return result.success? result.data: null;
}