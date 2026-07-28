import "dotenv/config";
import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";


if(process.env.STREAM_API_KEY || process.env.STREAM_API_SECRET){
    console.log("Stream API key and secret are configured");
}

export const chatClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY, 
    process.env.STREAM_API_SECRET
); // used for chat messaging

export const streamClient = new StreamClient(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
); // used for video mess


export const upsertStreamUser = async(userData)=>{
    try {
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully");
    } catch (error) {
        console.error("Error upserting stream user:", error);
    }
}

export const deleteStreamUser = async(userId)=>{
    try {
        await chatClient.deleteUsers([userId]);
        console.log("Stream user deleted successfully");
    } catch (error) {
        console.error("Error deleting stream user:", error);
    }
}