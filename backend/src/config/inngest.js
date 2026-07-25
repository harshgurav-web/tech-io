import { Inngest } from "inngest";
import connectDB from "./db.js";
import userModel from "../models/user.model.js";

export const inngest = new Inngest({ id: "talent-iq" });

// User Created
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();

      // Handle both raw Clerk payload and wrapped Inngest payload structures
      const userData = event.data.user || event.data;

      // Extract primary email cleanly
      const email =
        userData.email_addresses?.[0]?.email_address || "";

      // Fallback username construction
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const username = fullName || email.split("@")[0] || "User";

      // Upsert: prevents duplicate key errors if the event triggers twice
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
      throw error; // Re-throw so Inngest marks the run as failed for observability
    }
  }
);

// User Deleted
const deleteUser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
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
  }
);

export const functions = [syncUser, deleteUser];