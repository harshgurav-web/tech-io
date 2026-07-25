import { StreamChat } from "stream-chat";

if(process.env.STREAM_API_KEY || process.env.STREAM_API_SECRET){
    console.log("Stream API key and secret are configured");
}

export const chatClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY, 
    process.env.STREAM_API_SECRET
);

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