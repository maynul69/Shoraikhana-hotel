import { Webhook } from "svix";
import mongoose from "mongoose";
import User from "../models/user.js";

export default async function clerkWebhooks(req, res) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error(" Missing CLERK_WEBHOOK_SECRET");
      return res.status(500).send("Server misconfiguration");
    }

    const svixId = req.header("svix-id");
    const svixTimestamp = req.header("svix-timestamp");
    const svixSignature = req.header("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing Svix headers");
      return res.status(400).send("Missing Svix headers");
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    const payloadString = req.body.toString("utf8");

    let event;
    try {
      const verified = wh.verify(payloadString, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
      event = typeof verified === "string" ? JSON.parse(verified) : verified;
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).send("Webhook verification failed");
    }

    console.log("Verified Clerk event:", event.type);

    if (event.type === "user.created") {
      const data = event.data;
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

      console.log(`User created/updated: ${data.id}`);
    }

    if (event.type === "user.deleted") {
      const uid = event.data?.id || event.data?.user_id || event.id;
      if (uid) {
        await User.findByIdAndDelete(uid);
        console.log(`User deleted: ${uid}`);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return res.status(500).send("Internal server error");
  }
}
















// import User from "../models/user.js";
// import { Webhook } from "svix";

// const clerkWebhooks = async (req, res) => {
//     try {
//         //create svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//         //getting headers
//         const headers = {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"],
//         };


        
//         //verify the headers
//         await whook.verify(JSON.stringify(req.body), headers);

//         //GETTING DATA FROM RQ BODY
//         const {  data, type } = req.body;

//         const userData = {
//             _id: data.id,
//             email: data.email_addresses[0].email_address,
//             username: data.first_name + " " + data.last_name,
//             image:data.image_url,
//         }

//         //switch case for different types of events
//         switch (type) {
//             case "user.created": {
//                 await User.create(userData);
//                 break;
//             }
//             case "user.updated": {
//                 await User.findByIdAndUpdate(data.id, userData);
//                 break;
//             }
//             case "user.deleted": {
//                 await User.findByIdAndDelete(data.id, userData);
//                 break;
//             }
                
                
        
//             default:
//                 break;
//         }
//         res.json({success:true, message: "Webhook Recived"});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success:false, message: error.message});
//     }
// }
 
// export default clerkWebhooks;