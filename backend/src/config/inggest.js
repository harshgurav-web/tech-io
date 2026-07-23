import { Inngest } from "inngest";
import connectDB from "./db";
import userModel from "../models/user.model";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
    {id:"syncUser"},
    {name:"Sync User"},
    async ({event})=>{

        await connectDB();
        const {id, email_addresses, first_name,last_name,image_url}= event.data;
        
        const newUser = {
            clerkId:id,
            email:email_addresses[0].email_address,
            username: `${first_name} `+`${last_name}`,
            avatar:image_url,
        }
        await userModel.create(newUser)
        
    }
)

const deleteUser = inngest.createFunction(
    {id:"deleteUser"},
    {name:"Delete User"},
    async ({event})=>{

        await connectDB();
        const {id}= event.data;
        
       await userModel.deleteOne({clerkId:id})
        
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUser];