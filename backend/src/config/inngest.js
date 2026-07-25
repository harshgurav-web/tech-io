import { Inngest } from "inngest";
import connectDB from "./db.js";
import userModel from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

// User Created
const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const userData = event.data.user || event.data;
      const email = userData.email_addresses?.[0]?.email_address || "";
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      const username = `${firstName} ${lastName}`.trim() || email.split("@")[0] || "User";
      const avatar = userData.image_url || userData.profile_image_url || "";

      // 1. Sync to MongoDB
      await userModel.findOneAndUpdate(
        { clerkId: userData.id },
        {
          clerkId: userData.id,
          email: email,
          username: username,
          avatar: avatar,
        },
        { upsert: true, new: true }
      );
      console.log(`Successfully synced user ${userData.id} to MongoDB`);

      // 2. Sync to Stream (Moved INSIDE try block so userData & avatar exist)
      await upsertStreamUser({
        id: userData.id.toString(),
        name: username,
        image: avatar,
      });

    } catch (error) {
      console.error("Error syncing user:", error);
      throw error;
    }
  }
);

// User Deleted
const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      await connectDB();
      const userData = event.data.user || event.data;

      // 1. Delete from MongoDB
      await userModel.deleteOne({
        clerkId: userData.id,
      });
      console.log(`Successfully deleted user ${userData.id} from MongoDB`);

      // 2. Delete from Stream
      await deleteStreamUser(userData.id.toString());

    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
);

export const functions = [syncUser, deleteUser];