import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebHooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";

connectDB();

const app = express();
app.use(cors());

// Clerk Webhooks route → must use raw body for Svix verification
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Normal middleware
app.use(express.json());
app.use(clerkMiddleware());

// Example route
app.get("/", (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
