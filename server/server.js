import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// Parse JSON for all routes EXCEPT webhooks
app.use(express.json());

// Clerk authentication middleware
app.use(clerkMiddleware());

// Webhook route with raw body parsing for signature verification
app.use("/api/clerk", express.raw({ type: "*/*" }), clerkWebhooks);

// Test route
app.get("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
