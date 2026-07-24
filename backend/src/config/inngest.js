import { Inngest } from "inngest";
import connectDB from "./db.js";
import userModel from "../models/user.model.js";

export const inngest = new Inngest({
  id: "talent-iq",
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    event: "clerk/user.created",
  },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    await userModel.create({
      clerkId: id,
      email: email_addresses[0].email_address,
      username: `${first_name} ${last_name}`,
      avatar: image_url,
    });
  }
);

const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    await connectDB();

    await userModel.deleteOne({
      clerkId: event.data.id,
    });
  }
);

export const functions = [syncUser, deleteUser];