import { Inngest } from "inngest";
import connectDB from "./db.js";
import userModel from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

// User Created
const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }], // Triggers belong INSIDE the 1st object argument
  },
  async ({ event }) => {
    try {
      await connectDB();

      const userData = event.data.user || event.data;
      const email = userData.email_addresses?.[0]?.email_address || "";
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      const username = `${firstName} ${lastName}`.trim() || email.split("@")[0] || "User";

      await userModel.findOneAndUpdate(
        { clerkId: userData.id },
        {
          clerkId: userData.id,
          email: email,
          username: username,
          avatar: userData.image_url || userData.profile_image_url || "",
        },
        { upsert: true, new: true }
      );

      console.log(`Successfully synced user ${userData.id} to MongoDB`);
    } catch (error) {
      console.error("Error syncing user to MongoDB:", error);
      throw error;
    }

    await upsertStreamUser({
      id: userData.id.toString(),
      name: username,
      image: userData.avatar,
    })
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

      await userModel.deleteOne({
        clerkId: userData.id,
      });

      console.log(`Successfully deleted user ${userData.id} from MongoDB`);
    } catch (error) {
      console.error("Error deleting user from MongoDB:", error);
      throw error;
    }
    await deleteStreamUser(userData.id.toString());
  }
);

export const functions = [syncUser, deleteUser];