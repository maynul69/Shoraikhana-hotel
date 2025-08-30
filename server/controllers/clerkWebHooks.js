import { Webhook } from "svix";
import mongoose from "mongoose";
import User from "../models/user.js";

export default async function clerkWebhooks(req, res) {
  try {
    // Ensure DB is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error("Missing CLERK_WEBHOOK_SECRET");
      return res.status(500).send("Server misconfiguration");
    }

    // Svix headers
    const svixId = req.header("svix-id");
    const svixTimestamp = req.header("svix-timestamp");
    const svixSignature = req.header("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing Svix headers");
      return res.status(400).send("Missing Svix headers");
    }

    // IMPORTANT: req.body is raw buffer because of express.raw()
    const payloadString = req.body.toString("utf8");
    const wh = new Webhook(WEBHOOK_SECRET);

    let event;
    try {
      event = wh.verify(payloadString, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).send("Webhook verification failed");
    }

    console.log("✅ Verified Clerk event:", event.type);
    const data = event.data;

    switch (event.type) {
      case "user.created": {
        const primaryEmailId = data.primary_email_address_id;
        const emailObj = (data.email_addresses || []).find(
          (e) => e.id === primaryEmailId
        );
        const email = emailObj?.email_address || "";
        const username =
          data.username || data.first_name || data.last_name || data.id;

        await User.findByIdAndUpdate(
          data.id,
          {
            _id: data.id,
            username,
            email,
            image: data.image_url || data.profile_image_url || "",
            role: "user",
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`👤 User created/updated in MongoDB: ${data.id}`);
        break;
      }

      case "user.updated": {
        const primaryEmailId = data.primary_email_address_id;
        const emailObj = (data.email_addresses || []).find(
          (e) => e.id === primaryEmailId
        );
        const email = emailObj?.email_address || "";
        const username =
          data.username || data.first_name || data.last_name || data.id;

        await User.findByIdAndUpdate(
          data.id,
          {
            username,
            email,
            image: data.image_url || data.profile_image_url || "",
          },
          { new: true }
        );

        console.log(`✏️ User updated in MongoDB: ${data.id}`);
        break;
      }

      case "user.deleted": {
        const uid = data?.id || data?.user_id || event.id;
        if (uid) {
          await User.findByIdAndDelete(uid);
          console.log(`🗑️ User deleted from MongoDB: ${uid}`);
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Clerk webhook error:", err);
    return res.status(500).send("Internal server error");
  }
}
