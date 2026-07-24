import { Inngest } from "inngest";
import connectDB from "./db.js";
import userModel from "../models/user.model.js";

// Initialize Inngest client
export const inngest = new Inngest({
  id: "talent-iq",
});

// Function to handle clerk/user.created
const syncUser = inngest.createFunction(
  { id: "sync-user", name: "Sync Clerk User Created" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const primaryEmail = email_addresses?.[0]?.email_address || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || primaryEmail.split("@")[0] || "User";

    await userModel.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email: primaryEmail,
        username: fullName,
        avatar: image_url || "",
      },
      { upsert: true, new: true }
    );
  }
);


// Function to handle clerk/user.deleted
const deleteUser = inngest.createFunction(
  { id: "delete-user", name: "Delete Clerk User" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    await userModel.deleteOne({
      clerkId: event.data.id,
    });
  }
);

export const functions = [syncUser, updateUser, deleteUser];