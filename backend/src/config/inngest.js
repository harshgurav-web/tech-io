import { Inngest } from "inngest";
import connectDB from "./db.js";
import userModel from "../models/user.model.js";

export const inngest = new Inngest({ id: "talent-iq" });

// User Created
const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    await connectDB();

    await userModel.create({
      clerkId: event.data.id,
      email: event.data.email_addresses[0].email_address,
      username: `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim(),
      avatar: event.data.image_url,
    });
  }
);

// User Deleted
const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    triggers: { event: "clerk/user.deleted" },
  },
  async ({ event }) => {
    await connectDB();

    await userModel.deleteOne({
      clerkId: event.data.id,
    });
  }
);

export const functions = [syncUser, deleteUser];