import User from "../models/user.js";
import { Webhook } from "svix";
import getRawBody from "raw-body";

const clerkWebhooks = async (req, res) => {
  try {
    // Create svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Get headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Get raw body as string (important for signature verification)
    const payload = (await getRawBody(req)).toString("utf8");

    // Verify signature
    whook.verify(payload, headers);

    // Parse JSON AFTER verification
    const { data, type } = JSON.parse(payload);

    // Prepare user data
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || null,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || null,
    };

    // Handle event types
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    res.json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
